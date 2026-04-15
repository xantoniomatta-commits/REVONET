const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Zenith:ZenZone1@revonet.j86zjlv.mongodb.net/?retryWrites=true&w=majority&appName=REVONET';
const DB_NAME = 'revonet';

let db, usersCollection, serversCollection, serverMessagesCollection, conversationsCollection, dmMessagesCollection, friendsCollection, notificationsCollection;

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    usersCollection = db.collection('users');
    serversCollection = db.collection('servers');
    serverMessagesCollection = db.collection('server_messages');
    conversationsCollection = db.collection('conversations');
    dmMessagesCollection = db.collection('dm_messages');
    friendsCollection = db.collection('friends');
    notificationsCollection = db.collection('notifications');
    console.log(`✅ Connected to MongoDB: ${DB_NAME}`);
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

const clients = new Map();
const userSockets = new Map();

wss.on('connection', (ws) => {
  let userId = null;
  let currentChannelId = null;
  
  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data);
      
      if (msg.type === 'auth') {
        userId = msg.userId;
        userSockets.set(userId, ws);
        clients.set(ws, { userId });
        console.log(`📡 User ${userId} connected`);
        broadcastUserStatus(userId, 'online');
      }
      
      else if (msg.type === 'join_channel' && userId) {
        currentChannelId = msg.channelId;
        console.log(`📺 User ${userId} joined channel ${currentChannelId}`);
        
        if (serverMessagesCollection) {
          const messages = await serverMessagesCollection.find({ 
            channelId: currentChannelId
          }).sort({ timestamp: -1 }).limit(50).toArray();
          ws.send(JSON.stringify({ type: 'history', messages: messages.reverse() }));
        }
      }
      
      else if (msg.type === 'chat' && userId && currentChannelId) {
        const message = {
          channelId: currentChannelId,
          senderId: new ObjectId(userId),
          senderName: msg.senderName,
          content: msg.content,
          attachments: msg.attachments || [],
          replyTo: msg.replyTo || null,
          mentions: extractMentions(msg.content),
          edited: false,
          deleted: false,
          timestamp: new Date()
        };
        
        const result = await serverMessagesCollection.insertOne(message);
        message._id = result.insertedId;
        
        broadcastToChannel(currentChannelId, { type: 'message', message });
        
        message.mentions.forEach(async (username) => {
          const user = await usersCollection.findOne({ username });
          if (user && user._id.toString() !== userId) {
            await notificationsCollection.insertOne({
              userId: user._id,
              type: 'mention',
              read: false,
              data: { messageId: message._id, channelId: currentChannelId, from: msg.senderName },
              createdAt: new Date()
            });
            notifyUser(user._id.toString(), { type: 'notification', content: `${msg.senderName} mentioned you` });
          }
        });
      }
      
      else if (msg.type === 'edit_message' && userId) {
        await serverMessagesCollection.updateOne(
          { _id: new ObjectId(msg.messageId), senderId: new ObjectId(userId) },
          { $set: { content: msg.content, edited: true, editedAt: new Date() } }
        );
        broadcastToChannel(msg.channelId, { type: 'message_edited', messageId: msg.messageId, content: msg.content });
      }
      
      else if (msg.type === 'delete_message' && userId) {
        await serverMessagesCollection.updateOne(
          { _id: new ObjectId(msg.messageId), senderId: new ObjectId(userId) },
          { $set: { deleted: true, deletedAt: new Date() } }
        );
        broadcastToChannel(msg.channelId, { type: 'message_deleted', messageId: msg.messageId });
      }
      
      else if (msg.type === 'typing' && userId) {
        broadcastToChannel(msg.channelId, { type: 'typing', userId, username: msg.username }, ws);
      }
      
    } catch (e) {
      console.error('WebSocket error:', e.message);
    }
  });
  
  ws.on('close', () => {
    if (userId) {
      console.log(`❌ User ${userId} disconnected`);
      userSockets.delete(userId);
      clients.delete(ws);
      broadcastUserStatus(userId, 'offline');
    }
  });
});

function broadcastToChannel(channelId, message, excludeWs = null) {
  clients.forEach((data, ws) => {
    if (ws !== excludeWs && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(message));
    }
  });
}

function broadcastUserStatus(userId, status) {
  const message = JSON.stringify({ type: 'user_status', userId, status });
  clients.forEach((_, ws) => {
    if (ws.readyState === WebSocket.OPEN) ws.send(message);
  });
}

function notifyUser(userId, notification) {
  const ws = userSockets.get(userId);
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(notification));
  }
}

function extractMentions(content) {
  const matches = content.match(/@(\w+)/g) || [];
  return matches.map(m => m.substring(1));
}

// === API ROUTES ===

app.post('/api/register', async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) return res.status(400).json({ error: 'All fields required' });
    
    const existing = await usersCollection.findOne({ $or: [{ email }, { username }] });
    if (existing) return res.status(400).json({ error: 'Email or username already taken' });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await usersCollection.insertOne({
      email, password: hashedPassword, username,
      avatar: null, status: 'offline', bio: '',
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
      channels: [
        { _id: new ObjectId(), name: 'welcome', type: 'text' },
        { _id: new ObjectId(), name: 'general', type: 'text' }
      ],
      createdAt: new Date()
    });
    
    await usersCollection.updateOne({ _id: new ObjectId(userId) }, { $addToSet: { servers: result.insertedId } });
    res.json({ success: true, serverId: result.insertedId, inviteCode: code });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/channels/:channelId/messages', async (req, res) => {
  try {
    const { channelId } = req.params;
    const messages = await serverMessagesCollection.find({ 
      channelId: channelId,
      deleted: { $ne: true }
    }).sort({ timestamp: -1 }).limit(100).toArray();
    res.json({ messages: messages.reverse() });
  } catch (error) {
    console.error('Error loading messages:', error);
    res.status(500).json({ error: 'Server error' });
  }
});
// ===== ADD THIS AFTER your /api/channels/:channelId/messages endpoint =====

// Get server members (roster)
app.get('/api/servers/:serverId/members', async (req, res) => {
  try {
    const { serverId } = req.params;
    const { userId } = req.query;
    
    // Find the server
    const server = await serversCollection.findOne({ 
      _id: new ObjectId(serverId)
    });
    
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }
    
    // Check if user is a member (optional - you can skip this check)
    const isMember = server.members?.some(m => m.toString() === userId || m === userId);
    if (!isMember && userId) {
      // Still return members but maybe limited info
      console.log(`User ${userId} requested members of server ${serverId}`);
    }
    
    // Get all member details
    const memberIds = (server.members || []).map(m => {
      // Handle both ObjectId objects and string IDs
      return typeof m === 'object' ? m : new ObjectId(m);
    });
    
    let members = [];
    if (memberIds.length > 0) {
      members = await usersCollection.find({ 
        _id: { $in: memberIds } 
      }).project({ 
        _id: 1, 
        username: 1, 
        email: 1, 
        avatar: 1, 
        status: 1,
        bio: 1 
      }).toArray();
    }
    
    // Format members with online status (you can track this via WebSocket later)
    const formattedMembers = members.map(member => ({
      _id: member._id,
      username: member.username,
      email: member.email,
      avatar: member.avatar || null,
      status: member.status || 'offline',
      bio: member.bio || ''
    }));
    
    res.json({ members: formattedMembers });
    
  } catch (error) {
    console.error('Error fetching server members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get single user profile
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { password: 0 } } // Don't send password
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ 
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        status: user.status || 'offline',
        bio: user.bio || '',
        createdAt: user.createdAt
      }
    });
    
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get server channels (if you need it)
app.get('/api/servers/:serverId/channels', async (req, res) => {
  try {
    const { serverId } = req.params;
    
    const server = await serversCollection.findOne({ 
      _id: new ObjectId(serverId)
    });
    
    if (!server) {
      return res.status(404).json({ error: 'Server not found' });
    }
    
    res.json({ channels: server.channels || [] });
    
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.status(500).json({ error: 'Failed to fetch channels' });
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

app.get('/api/friends/pending', async (req, res) => {
  try {
    const { userId } = req.query;
    const requests = await friendsCollection.find({
      friendId: new ObjectId(userId),
      status: 'pending'
    }).toArray();
    
    const enriched = await Promise.all(requests.map(async (req) => {
      const fromUser = await usersCollection.findOne({ _id: req.userId });
      return { id: req._id, fromUsername: fromUser.username };
    }));
    
    res.json({ requests: enriched });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/friends/request', async (req, res) => {
  try {
    const { userId, targetUsername } = req.body;
    const target = await usersCollection.findOne({ username: targetUsername });
    if (!target) return res.status(404).json({ error: 'User not found' });
    if (target._id.toString() === userId) return res.status(400).json({ error: 'Cannot friend yourself' });
    
    const existing = await friendsCollection.findOne({
      $or: [
        { userId: new ObjectId(userId), friendId: target._id },
        { userId: target._id, friendId: new ObjectId(userId) }
      ]
    });
    if (existing) return res.status(400).json({ error: 'Friend request already exists' });
    
    await friendsCollection.insertOne({
      userId: new ObjectId(userId), friendId: target._id,
      status: 'pending', createdAt: new Date()
    });
    
    const fromUser = await usersCollection.findOne({ _id: new ObjectId(userId) });
    await notificationsCollection.insertOne({
      userId: target._id, type: 'friend_request', read: false,
      data: { fromId: userId, fromUsername: fromUser.username },
      createdAt: new Date()
    });
    
    notifyUser(target._id.toString(), { type: 'notification', content: `${fromUser.username} sent you a friend request` });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/friends/accept', async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    await friendsCollection.updateOne(
      { _id: new ObjectId(requestId), friendId: new ObjectId(userId) },
      { $set: { status: 'accepted' } }
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/friends/decline', async (req, res) => {
  try {
    const { userId, requestId } = req.body;
    await friendsCollection.deleteOne({ _id: new ObjectId(requestId), friendId: new ObjectId(userId) });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// DMs
app.get('/api/dm/conversations', async (req, res) => {
  try {
    const { userId } = req.query;
    const conversations = await conversationsCollection.find({
      participants: new ObjectId(userId)
    }).toArray();
    
    const enriched = await Promise.all(conversations.map(async (conv) => {
      const otherId = conv.participants.find(id => id.toString() !== userId);
      const otherUser = await usersCollection.findOne({ _id: otherId });
      const lastMsg = await dmMessagesCollection.findOne(
        { conversationId: conv._id },
        { sort: { timestamp: -1 } }
      );
      return {
        id: conv._id,
        otherUser: { id: otherUser._id, username: otherUser.username },
        lastMessage: lastMsg
      };
    }));
    
    res.json({ conversations: enriched });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/dm/create', async (req, res) => {
  try {
    const { userId, targetUserId } = req.body;
    
    let conv = await conversationsCollection.findOne({
      participants: { $all: [new ObjectId(userId), new ObjectId(targetUserId)] }
    });
    
    if (!conv) {
      const result = await conversationsCollection.insertOne({
        participants: [new ObjectId(userId), new ObjectId(targetUserId)],
        createdAt: new Date()
      });
      conv = { _id: result.insertedId };
    }
    
    res.json({ conversationId: conv._id });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/dm/messages', async (req, res) => {
  try {
    const { conversationId } = req.query;
    const messages = await dmMessagesCollection.find({
      conversationId: new ObjectId(conversationId)
    }).sort({ timestamp: 1 }).limit(100).toArray();
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/dm/send', async (req, res) => {
  try {
    const { conversationId, senderId, senderName, content } = req.body;
    
    const message = {
      conversationId: new ObjectId(conversationId),
      senderId: new ObjectId(senderId),
      senderName,
      content,
      timestamp: new Date(),
      readBy: [new ObjectId(senderId)]
    };
    
    await dmMessagesCollection.insertOne(message);
    
    const conv = await conversationsCollection.findOne({ _id: new ObjectId(conversationId) });
    const recipientId = conv.participants.find(id => id.toString() !== senderId);
    notifyUser(recipientId.toString(), { type: 'dm', message });
    
    res.json({ success: true, message });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/upload', (req, res) => {
  res.json({ url: 'https://via.placeholder.com/150', type: 'image/png' });
});

async function start() {
  await connectToDatabase();
  server.listen(PORT, () => {
    console.log(`🔒 REVONET SERVER READY`);
    console.log(`📍 Port ${PORT}`);
  });
}

start();
