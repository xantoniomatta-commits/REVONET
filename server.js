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
const MESSAGES_COLLECTION = 'messages';
const PINS_COLLECTION = 'pins';
const REACTIONS_COLLECTION = 'reactions';
const FRIENDS_COLLECTION = 'friends';
const DM_CONVERSATIONS_COLLECTION = 'dm_conversations';

let db, usersCollection, serversCollection, messagesCollection, pinsCollection, reactionsCollection, friendsCollection, dmConversationsCollection;

async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    usersCollection = db.collection(USERS_COLLECTION);
    serversCollection = db.collection(SERVERS_COLLECTION);
    messagesCollection = db.collection(MESSAGES_COLLECTION);
    pinsCollection = db.collection(PINS_COLLECTION);
    reactionsCollection = db.collection(REACTIONS_COLLECTION);
    friendsCollection = db.collection(FRIENDS_COLLECTION);
    dmConversationsCollection = db.collection(DM_CONVERSATIONS_COLLECTION);
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
app.get('/api/servers', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
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

// === Friends API ===
app.get('/api/friends', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    
    const friendships = await friendsCollection.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
      status: 'accepted'
    }).toArray();
    
    const friendIds = friendships.map(f => f.senderId === userId ? f.receiverId : f.senderId);
    
    const friends = [];
    for (const fid of friendIds) {
      if (!ObjectId.isValid(fid)) continue;
      const fUser = await usersCollection.findOne({ _id: new ObjectId(fid) });
      if (fUser) {
        friends.push({
          id: fUser._id.toString(),
          username: fUser.username,
          status: 'offline' // default status
        });
      }
    }
    
    res.json({ friends });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/friends/pending', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    
    const requests = await friendsCollection.find({
      receiverId: userId,
      status: 'pending'
    }).toArray();
    
    // Enrich with sender username
    for (const reqObj of requests) {
      if (ObjectId.isValid(reqObj.senderId)) {
        const sender = await usersCollection.findOne({ _id: new ObjectId(reqObj.senderId) });
        if (sender) {
          reqObj.senderUsername = sender.username;
        }
      }
    }
    
    res.json({ requests });
  } catch (error) {
    console.error('Get pending friends error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/friends/accept', async (req, res) => {
  try {
    const { requestId, userId } = req.body;
    if (!requestId || !userId) return res.status(400).json({ error: 'Missing parameters' });
    
    await friendsCollection.updateOne(
      { _id: new ObjectId(requestId), receiverId: userId },
      { $set: { status: 'accepted' } }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Accept friend error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/friends/decline', async (req, res) => {
  try {
    const { requestId, userId } = req.body;
    if (!requestId || !userId) return res.status(400).json({ error: 'Missing parameters' });
    
    await friendsCollection.deleteOne(
      { _id: new ObjectId(requestId), receiverId: userId }
    );
    res.json({ success: true });
  } catch (error) {
    console.error('Decline friend error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// === DM API ===
app.get('/api/dm/conversations', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'User ID required' });
    
    const convos = await dmConversationsCollection.find({
      participants: userId
    }).toArray();
    
    // Enrich with other user's info
    for (const conv of convos) {
      const otherUserId = conv.participants.find(id => id !== userId);
      if (otherUserId && ObjectId.isValid(otherUserId)) {
        const otherUser = await usersCollection.findOne({ _id: new ObjectId(otherUserId) });
        if (otherUser) {
          conv.otherUser = {
            _id: otherUser._id.toString(),
            username: otherUser.username
          };
        }
      }
    }
    
    res.json({ conversations: convos });
  } catch (error) {
    console.error('Get DMs error:', error);
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

// === WebSocket for Real-Time ===
const clients = new Map();

function broadcast(data) {
  const payload = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

wss.on('connection', (ws) => {
  console.log('📡 New WebSocket connection');

  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data);
      console.log('Received:', msg.type);

      switch (msg.type) {
        case 'auth':
          clients.set(ws, msg.userId);
          ws.send(JSON.stringify({ type: 'auth_success' }));
          break;

        case 'join_channel': {
          const channelId = msg.channelId;
          const messages = await messagesCollection.find({ channelId }).sort({ timestamp: 1 }).toArray();
          const pins = await pinsCollection.find({ channelId }).toArray();
          const reactions = await reactionsCollection.find({ channelId }).toArray();

          ws.send(JSON.stringify({
            type: 'history',
            channelId,
            messages,
            pins,
            reactions
          }));
          break;
        }

        case 'chat': {
          const newMsg = {
            _id: new ObjectId().toString(),
            channelId: msg.channelId,
            senderId: clients.get(ws) || msg.userId,
            senderName: msg.senderName,
            content: msg.content,
            replyTo: msg.replyTo,
            timestamp: new Date()
          };
          await messagesCollection.insertOne(newMsg);

          broadcast({
            type: 'message',
            ...newMsg
          });
          break;
        }

        case 'reaction': {
          const { messageId: rMsgId, emoji, channelId: rChanId, userId: rUserId } = msg;
          const existingReaction = await reactionsCollection.findOne({ messageId: rMsgId, emoji });

          if (existingReaction) {
            const users = existingReaction.users || [];
            if (users.includes(rUserId)) {
              await reactionsCollection.updateOne({ _id: existingReaction._id }, { $pull: { users: rUserId } });
            } else {
              await reactionsCollection.updateOne({ _id: existingReaction._id }, { $addToSet: { users: rUserId } });
            }
          } else {
            await reactionsCollection.insertOne({
              messageId: rMsgId,
              channelId: rChanId,
              emoji,
              users: [rUserId]
            });
          }

          const updatedReactions = await reactionsCollection.find({ messageId: rMsgId }).toArray();
          broadcast({
            type: 'reaction_update',
            messageId: rMsgId,
            reactions: updatedReactions
          });
          break;
        }

        case 'pin_message': {
          const { messageId: pMsgId, channelId: pChanId, content: pContent, author: pAuthor } = msg;
          await pinsCollection.updateOne(
            { messageId: pMsgId },
            { $set: { channelId: pChanId, content: pContent, author: pAuthor, timestamp: new Date() } },
            { upsert: true }
          );

          const allPins = await pinsCollection.find({ channelId: pChanId }).toArray();
          broadcast({
            type: 'pin_added',
            messageId: pMsgId,
            channelId: pChanId,
            pins: allPins
          });
          break;
        }

        case 'unpin_message': {
          const { messageId: uMsgId, channelId: uChanId } = msg;
          await pinsCollection.deleteOne({ messageId: uMsgId });

          const remainingPins = await pinsCollection.find({ channelId: uChanId }).toArray();
          broadcast({
            type: 'pin_removed',
            messageId: uMsgId,
            channelId: uChanId,
            pins: remainingPins
          });
          break;
        }

        case 'get_pins': {
          const { channelId: gChanId } = msg;
          const channelPinsList = await pinsCollection.find({ channelId: gChanId }).toArray();
          ws.send(JSON.stringify({
            type: 'pins_list',
            channelId: gChanId,
            pins: channelPinsList
          }));
          break;
        }

        case 'edit_message': {
          const { messageId: eMsgId, content: eContent } = msg;
          await messagesCollection.updateOne(
            { _id: eMsgId },
            { $set: { content: eContent, edited: true } }
          );
          broadcast({
            type: 'message_edited',
            messageId: eMsgId,
            content: eContent
          });
          break;
        }

        case 'delete_message': {
          const { messageId: dMsgId } = msg;
          await messagesCollection.deleteOne({ _id: dMsgId });

          // Also check if it's pinned and remove it
          const pinCheck = await pinsCollection.findOne({ messageId: dMsgId });
          if (pinCheck) {
            await pinsCollection.deleteOne({ messageId: dMsgId });
            const remainingPins = await pinsCollection.find({ channelId: pinCheck.channelId }).toArray();
            broadcast({
              type: 'pin_removed',
              messageId: dMsgId,
              channelId: pinCheck.channelId,
              pins: remainingPins
            });
          }

          broadcast({
            type: 'message_deleted',
            messageId: dMsgId
          });
          break;
        }
      }

    } catch (e) {
      console.error('WebSocket error:', e.message);
    }
  });

  ws.on('close', () => {
    console.log('❌ WebSocket disconnected');
    clients.delete(ws);
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
