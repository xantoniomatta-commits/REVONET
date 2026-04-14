const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

const app = express();
app.use(cors());
app.use(express.json());

// Cloudinary Setup (for images/videos/files)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'your-cloud-name',
  api_key: process.env.CLOUDINARY_API_KEY || 'your-api-key',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'your-secret'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'revonet',
    resource_type: 'auto'
  }
});
const upload = multer({ storage });

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// MongoDB Setup
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Zenith:ZenZone1@revonet.j86zjlv.mongodb.net/?retryWrites=true&w=majority&appName=REVONET';
const DB_NAME = 'revonet';

let db, usersCollection, serversCollection, messagesCollection, conversationsCollection, friendsCollection, notificationsCollection;

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    usersCollection = db.collection('users');
    serversCollection = db.collection('servers');
    messagesCollection = db.collection('messages');
    conversationsCollection = db.collection('conversations');
    friendsCollection = db.collection('friends');
    notificationsCollection = db.collection('notifications');
    console.log(`✅ Connected to MongoDB: ${DB_NAME}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

// WebSocket Connections
const clients = new Map();
const typingUsers = new Map();

wss.on('connection', (ws) => {
  let userId = null;
  let currentChannel = null;
  
  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data);
      
      if (msg.type === 'auth') {
        userId = msg.userId;
        clients.set(userId, ws);
        broadcastUserStatus(userId, 'online');
      }
      
      else if (msg.type === 'typing') {
        typingUsers.set(userId, { channel: msg.channel, timestamp: Date.now() });
        broadcastTyping(msg.channel, userId);
      }
      
      else if (msg.type === 'chat') {
        const message = {
          channelId: msg.channelId,
          senderId: userId,
          senderName: msg.senderName,
          content: msg.content,
          type: msg.messageType || 'text',
          attachments: msg.attachments || [],
          replyTo: msg.replyTo || null,
          mentions: extractMentions(msg.content),
          edited: false,
          deleted: false,
          timestamp: new Date()
        };
        
        const result = await messagesCollection.insertOne(message);
        message._id = result.insertedId;
        
        broadcastToChannel(msg.channelId, { type: 'message', message });
        
        // Send notifications for mentions
        message.mentions.forEach(async (username) => {
          const user = await usersCollection.findOne({ username });
          if (user && user._id.toString() !== userId) {
            await notificationsCollection.insertOne({
              userId: user._id,
              type: 'mention',
              read: false,
              data: { messageId: message._id, channelId: msg.channelId, from: msg.senderName },
              createdAt: new Date()
            });
            notifyUser(user._id.toString(), { type: 'mention', message });
          }
        });
      }
      
      else if (msg.type === 'edit_message') {
        await messagesCollection.updateOne(
          { _id: new ObjectId(msg.messageId), senderId: userId },
          { $set: { content: msg.content, edited: true, editedAt: new Date() } }
        );
        broadcastToChannel(msg.channelId, { type: 'message_edited', messageId: msg.messageId, content: msg.content });
      }
      
      else if (msg.type === 'delete_message') {
        await messagesCollection.updateOne(
          { _id: new ObjectId(msg.messageId), senderId: userId },
          { $set: { deleted: true, deletedAt: new Date() } }
        );
        broadcastToChannel(msg.channelId, { type: 'message_deleted', messageId: msg.messageId });
      }
      
      else if (msg.type === 'reaction') {
        await messagesCollection.updateOne(
          { _id: new ObjectId(msg.messageId) },
          { $addToSet: { [`reactions.${msg.emoji}`]: userId } }
        );
        broadcastToChannel(msg.channelId, { type: 'reaction', messageId: msg.messageId, emoji: msg.emoji, userId });
      }
      
    } catch (e) {
      console.error('WebSocket error:', e);
    }
  });
  
  ws.on('close', () => {
    if (userId) {
      clients.delete(userId);
      broadcastUserStatus(userId, 'offline');
    }
  });
});

function extractMentions(content) {
  const matches = content.match(/@(\w+)/g) || [];
  return matches.map(m => m.substring(1));
}

function broadcastToChannel(channelId, message) {
  clients.forEach((ws, uid) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ ...message, channelId }));
    }
  });
}

function broadcastUserStatus(userId, status) {
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'user_status', userId, status }));
    }
  });
}

function broadcastTyping(channelId, userId) {
  clients.forEach((ws) => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'typing', channelId, userId }));
    }
  });
}

function notifyUser(userId, notification) {
  const ws = clients.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(notification));
  }
}

// === API ROUTES ===

// Auth
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) return res.status(400).json({ error: 'All fields required' });
    
    const existing = await usersCollection.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ error: 'Email or username already taken' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await usersCollection.insertOne({
      email, password: hashedPassword, username,
      avatar: null, status: 'online', bio: '',
      friends: [], servers: [],
      createdAt: new Date()
    });
    
    res.json({ success: true, userId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    
    await usersCollection.updateOne({ _id: user._id }, { $set: { status: 'online' } });
    
    res.json({
      success: true,
      user: { id: user._id, email: user.email, username: user.username, avatar: user.avatar, status: 'online' }
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Servers
app.get('/api/servers', async (req, res) => {
  try {
    const { userId } = req.query;
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    const servers = await serversCollection.find({ _id: { $in: user.servers || [] } }).toArray();
    res.json({ servers });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/servers/join', async (req, res) => {
  try {
    const { userId, inviteCode } = req.body;
    const server = await serversCollection.findOne({ inviteCode });
    if (!server) return res.status(404).json({ error: 'Invalid invite code' });
    
    const userObjId = new ObjectId(userId);
    await serversCollection.updateOne({ _id: server._id }, { $addToSet: { members: userObjId } });
    await usersCollection.updateOne({ _id: userObjId }, { $addToSet: { servers: server._id } });
    
    res.json({ success: true, server });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/servers/create', async (req, res) => {
  try {
    const { userId, name, inviteCode } = req.body;
    const code = inviteCode || name.substring(0, 4).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    const result = await serversCollection.insertOne({
      name, inviteCode: code, ownerId: new ObjectId(userId),
      members: [new ObjectId(userId)],
      channels: [{ name: 'general', type: 'text' }],
      createdAt: new Date()
    });
    
    await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $addToSet: { servers: result.insertedId } });
    res.json({ success: true, serverId: result.insertedId, inviteCode: code });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Messages
app.get('/api/messages', async (req, res) => {
  try {
    const { channelId, limit = 50, before } = req.query;
    const query = { channelId, deleted: { $ne: true } };
    if (before) query.timestamp = { $lt: new Date(before) };
    
    const messages = await messagesCollection.find(query).sort({ timestamp: -1 }).limit(parseInt(limit)).toArray();
    res.json({ messages: messages.reverse() });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Friends
app.get('/api/friends', async (req, res) => {
  try {
    const { userId } = req.query;
    const friendships = await friendsCollection.find({
      $or: [{ userId: new ObjectId(userId) }, { friendId: new ObjectId(userId) }],
      status: 'accepted'
    }).toArray();
    
    const friendIds = friendships.map(f => f.userId.toString() === userId ? f.friendId : f.userId);
    const friends = await usersCollection.find({ _id: { $in: friendIds } }).project({ username: 1, avatar: 1, status: 1 }).toArray();
    
    res.json({ friends });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/friends/request', async (req, res) => {
  try {
    const { userId, targetUsername } = req.body;
    const target = await usersCollection.findOne({ username: targetUsername });
    if (!target) return res.status(404).json({ error: 'User not found' });
    
    await friendsCollection.insertOne({
      userId: new ObjectId(userId), friendId: target._id,
      status: 'pending', createdAt: new Date()
    });
    
    await notificationsCollection.insertOne({
      userId: target._id, type: 'friend_request', read: false,
      data: { fromId: userId, fromUsername: (await usersCollection.findOne({ _id: new ObjectId(userId) })).username },
      createdAt: new Date()
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// File Upload
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    res.json({ url: req.file.path, type: req.file.mimetype });
  } catch (error) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Start Server
async function start() {
  await connectToDatabase();
  server.listen(PORT, () => {
    console.log(`🔒 REVONET v2 SERVER READY`);
    console.log(`📍 Port ${PORT}`);
  });
}

start();
