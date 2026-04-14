const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const { MongoClient } = require('mongodb');
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

let db, usersCollection, serversCollection;

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    usersCollection = db.collection(USERS_COLLECTION);
    serversCollection = db.collection(SERVERS_COLLECTION);
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
    
    // Check if user already exists
    const existing = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
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
    
    // Find user
    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Return user data (never return password)
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        servers: user.servers
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
    
    const user = await usersCollection.findOne({ _id: new MongoClient.ObjectId(userId) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // Get full server details for each server ID
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
    
    // Find server by invite code
    const server = await serversCollection.findOne({ inviteCode: inviteCode.toUpperCase() });
    if (!server) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }
    
    const userObjectId = new MongoClient.ObjectId(userId);
    
    // Check if user already in server
    const user = await usersCollection.findOne({ _id: userObjectId });
    if (user.servers && user.servers.includes(server._id)) {
      return res.status(400).json({ error: 'Already a member of this server' });
    }
    
    // Add user to server's members
    await serversCollection.updateOne(
      { _id: server._id },
      { $addToSet: { members: userObjectId } }
    );
    
    // Add server to user's servers
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
    
    const userObjectId = new MongoClient.ObjectId(userId);
    
    // Generate invite code if not provided
    const code = inviteCode || serverName.substring(0, 4).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    // Create server
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
    
    // Add server to user's servers
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
// Verify agent access code
app.post('/verify-agent', (req, res) => {
  const { accessCode } = req.body;
  
  // Check if access code matches any agent
  const agent = Object.entries(AGENTS).find(([name, data]) => data.accessCode === accessCode);
  
  if (agent) {
    res.json({ 
      valid: true, 
      agent: agent[0],
      title: agent[1].title 
    });
  } else {
    res.json({ valid: false });
  }
});
// === WebSocket for Real-Time ===
wss.on('connection', (ws) => {
  console.log('📡 New WebSocket connection');
  
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data);
      console.log('Received:', msg.type);
      
      // Handle different message types here (Phase 2)
      
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
