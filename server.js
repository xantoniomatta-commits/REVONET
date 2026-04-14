const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const PORT = process.env.PORT || 8080;

// === MongoDB Setup ===

const MONGODB_URI = 'mongodb+srv://Zenith:ZenZone1@revonet.j86zjlv.mongodb.net/?retryWrites=true&w=majority&appName=REVONET';
const DB_NAME = 'revonet';
const USERS_COLLECTION = 'users';
const SERVERS_COLLECTION = 'servers';

let db, usersCollection, serversCollection, conversationsCollection, dmMessagesCollection;

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    usersCollection = db.collection('users');
    serversCollection = db.collection('servers');
    conversationsCollection = db.collection('conversations');
    dmMessagesCollection = db.collection('dm_messages');
    console.log(`✅ Connected to MongoDB: ${DB_NAME}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

// === Middleware ===
app.use(cors());
app.use(express.json());

// === Routes ===

// Register new account
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    
    if (!email || !password || !username) {
      return res.status(400).json({ error: 'All fields required' });
    }
    
    const existing = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await usersCollection.insertOne({
      email: email.toLowerCase(),
      password: hashedPassword,
      username,
      createdAt: new Date(),
      servers: []
    });
    
    res.json({ success: true, userId: result.insertedId });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        servers: user.servers || []
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's servers
app.get('/api/user/servers', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const serverIds = user.servers || [];
    const servers = await serversCollection.find({ _id: { $in: serverIds } }).toArray();
    
    res.json({ servers });
  } catch (error) {
    console.error('Get servers error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Join server via invite code
app.post('/api/servers/join', async (req, res) => {
  try {
    const { userId, inviteCode } = req.body;
    
    if (!userId || !inviteCode) {
      return res.status(400).json({ error: 'User ID and invite code required' });
    }
    
    const server = await serversCollection.findOne({ inviteCode: inviteCode.toUpperCase() });
    if (!server) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }
    
    const userObjectId = new ObjectId(userId);
    
    const user = await usersCollection.findOne({ _id: userObjectId });
    if (user.servers && user.servers.some(id => id.toString() === server._id.toString())) {
      return res.status(400).json({ error: 'Already a member of this server' });
    }
    
    await serversCollection.updateOne(
      { _id: server._id },
      { $addToSet: { members: userObjectId } }
    );
    
    await usersCollection.updateOne(
      { _id: userObjectId },
      { $addToSet: { servers: server._id } }
    );
    
    res.json({ success: true, server });
  } catch (error) {
    console.error('Join server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new server
app.post('/api/servers/create', async (req, res) => {
  try {
    const { userId, serverName, inviteCode } = req.body;
    
    if (!userId || !serverName) {
      return res.status(400).json({ error: 'User ID and server name required' });
    }
    
    const userObjectId = new ObjectId(userId);
    
    const code = inviteCode || serverName.substring(0, 4).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    const result = await serversCollection.insertOne({
      name: serverName,
      inviteCode: code,
      ownerId: userObjectId,
      members: [userObjectId],
      createdAt: new Date(),
      channels: [
        { name: 'welcome', type: 'text' },
        { name: 'general', type: 'text' }
      ]
    });
    
    await usersCollection.updateOne(
      { _id: userObjectId },
      { $addToSet: { servers: result.insertedId } }
    );
    
    res.json({ success: true, serverId: result.insertedId, inviteCode: code });
  } catch (error) {
    console.error('Create server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// === DM ROUTES ===

// Get user's DM conversations
app.get('/api/dm/conversations', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    
    const conversations = await conversationsCollection.find({
      participants: new ObjectId(userId)
    }).toArray();
    
    // Get last message and other participant info
    const enriched = await Promise.all(conversations.map(async (conv) => {
      const otherUserId = conv.participants.find(id => id.toString() !== userId);
      const otherUser = await usersCollection.findOne({ _id: otherUserId });
      const lastMsg = await dmMessagesCollection.findOne(
        { conversationId: conv._id },
        { sort: { timestamp: -1 } }
      );
      return {
        ...conv,
        otherUser: { id: otherUser._id, username: otherUser.username },
        lastMessage: lastMsg
      };
    }));
    
    res.json({ conversations: enriched });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start or get DM with another user
app.post('/api/dm/create', async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;
    if (!userId || !targetUserId) {
      return res.status(400).json({ error: 'Both user IDs required' });
    }
    
    const userObjId = new ObjectId(userId);
    const targetObjId = new ObjectId(targetUserId);
    
    // Check if conversation already exists
    let conv = await conversationsCollection.findOne({
      participants: { $all: [userObjId, targetObjId] }
    });
    
    if (!conv) {
      const result = await conversationsCollection.insertOne({
        participants: [userObjId, targetObjId],
        createdAt: new Date()
      });
      conv = { _id: result.insertedId, participants: [userObjId, targetObjId] };
    }
    
    res.json({ conversationId: conv._id });
  } catch (error) {
    console.error('Create DM error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get messages for a conversation
app.get('/api/dm/messages', async (req, res) => {
  try {
    const { conversationId } = req.query;
    if (!conversationId) return res.status(400).json({ error: 'Conversation ID required' });
    
    const messages = await dmMessagesCollection.find({
      conversationId: new ObjectId(conversationId)
    }).sort({ timestamp: 1 }).limit(100).toArray();
    
    res.json({ messages });
  } catch (error) {
    console.error('Get DM messages error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Send DM
app.post('/api/dm/send', async (req, res) => {
  try {
    const { conversationId, senderId, senderName, content } = req.body;
    if (!conversationId || !senderId || !content) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const message = {
      conversationId: new ObjectId(conversationId),
      senderId: new ObjectId(senderId),
      senderName,
      content,
      timestamp: new Date(),
      readBy: [new ObjectId(senderId)]
    };
    
    await dmMessagesCollection.insertOne(message);
    
    // Broadcast to WebSocket (we'll add this later)
    
    res.json({ success: true, message });
  } catch (error) {
    console.error('Send DM error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// === WebSocket for Real-Time ===
wss.on('connection', (ws) => {
  console.log('📡 New WebSocket connection');
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      console.log('Received:', msg.type);
    } catch (e) {
      console.error('WebSocket error:', e.message);
    }
  });
  
  ws.on('close', () => {
    console.log('❌ WebSocket disconnected');
  });
});

// === Start Server ===
async function start() {
  await connectToDatabase();
  server.listen(PORT, () => {
    console.log(`🔒 REVONET PLATFORM READY`);
    console.log(`📍 Server running on port ${PORT}`);
  });
}

start();
