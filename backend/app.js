const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

// Models
const Message = require('./models/message');
const User = require('./models/user');

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
     cors: {
          origin: process.env.CLIENT_URL || 'http://localhost:5173',
          methods: ['GET', 'POST', 'PATCH', 'DELETE'],
          allowedHeaders: ['Content-Type', 'Authorization'],
          credentials: true,
     }
});

// Middleware
app.use(cors({
     origin: process.env.CLIENT_URL || 'http://localhost:5173',
     methods: ['GET', 'POST', 'PATCH', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization'],
     credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/health', (req, res) => {
     res.status(200).json({
          status: 'OK',
          timestamp: new Date().toISOString(),
          uptime: process.uptime(),
          environment: process.env.NODE_ENV || 'development'
     });
});

app.use('/auth', require('./routes/auth'));
app.use('/messages', require('./routes/messages'));

// Socket middleware for authentication
io.use(async (socket, next) => {
     try {
          const token = socket.handshake.auth.token;
          if (!token) {
               return next(new Error('Authentication token required'));
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.userId);
          if (!user) {
               return next(new Error('User not found'));
          }

          socket.userId = user._id;
          socket.userType = user.type;
          next();
     } catch (error) {
          next(new Error('Authentication failed'));
     }
});

// Socket middleware for authentication
io.use(async (socket, next) => {
     try {
          const token = socket.handshake.auth.token;
          if (!token) {
               return next(new Error('Authentication token required'));
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const user = await User.findById(decoded.userId);
          if (!user) {
               return next(new Error('User not found'));
          }

          socket.userId = user._id;
          socket.userType = user.type;
          socket.userName = user.name;
          next();
     } catch (error) {
          console.error('Socket auth error:', error.message);
          next(new Error('Authentication failed'));
     }
});

// Store connected users
const connectedUsers = new Map();

// Socket events
io.on('connection', (socket) => {
     console.log(`Client connected: ${socket.userName} (${socket.userId})`);

     // Store user connection
     connectedUsers.set(socket.userId.toString(), {
          socketId: socket.id,
          userId: socket.userId,
          userName: socket.userName,
          userType: socket.userType,
          connectedAt: new Date()
     });

     // Join personal room
     socket.join(socket.userId.toString());

     // Broadcast online users to all clients
     io.emit('usersOnline', Array.from(connectedUsers.values()));

     socket.on('sendMessage', async (data) => {
          try {
               if (!data.receiverId || !data.content) {
                    throw new Error('Missing required message data');
               }

               // Sanitize and validate content
               const sanitizedContent = data.content.trim();
               if (sanitizedContent.length === 0) {
                    throw new Error('Message content cannot be empty');
               }
               if (sanitizedContent.length > 1000) {
                    throw new Error('Message content too long (max 1000 characters)');
               }

               // Filter inappropriate content (basic example)
               const forbiddenWords = ['spam', 'abuse']; // Add more as needed
               const containsForbidden = forbiddenWords.some(word =>
                    sanitizedContent.toLowerCase().includes(word.toLowerCase())
               );
               if (containsForbidden) {
                    throw new Error('Message contains inappropriate content');
               }

               const message = new Message({
                    senderId: socket.userId,
                    receiverId: data.receiverId,
                    content: sanitizedContent,
                    timestamp: new Date(),
                    seen: false
               });

               await message.save();

               // Send to receiver
               io.to(data.receiverId).emit('receiveMessage', {
                    ...message.toObject(),
                    isSentByMe: false
               });

               // Send confirmation to sender
               socket.emit('receiveMessage', {
                    ...message.toObject(),
                    isSentByMe: true
               });
          } catch (error) {
               console.error('Message error:', error.message);
               socket.emit('messageError', {
                    type: 'MESSAGE_ERROR',
                    message: error.message
               });
          }
     });

     socket.on('disconnect', (reason) => {
          console.log(`Client disconnected: ${socket.userName} (${socket.userId}) - Reason: ${reason}`);

          // Remove user from connected users
          connectedUsers.delete(socket.userId.toString());

          // Broadcast updated online users list
          io.emit('usersOnline', Array.from(connectedUsers.values()));
     });

     socket.on('reconnect', () => {
          console.log(`Client reconnected: ${socket.userName} (${socket.userId})`);

          // Update user connection
          connectedUsers.set(socket.userId.toString(), {
               socketId: socket.id,
               userId: socket.userId,
               userName: socket.userName,
               userType: socket.userType,
               connectedAt: new Date()
          });

          // Broadcast updated online users list
          io.emit('usersOnline', Array.from(connectedUsers.values()));
     });
});

// Error handling
app.use((err, req, res, next) => {
     console.error('Application error:', err.stack);

     // Ne pas exposer les détails d'erreur en production
     const isDevelopment = process.env.NODE_ENV === 'development';

     res.status(err.status || 500).json({
          error: true,
          message: isDevelopment ? err.message : 'Internal server error',
          ...(isDevelopment && { stack: err.stack })
     });
});

// Database connection and server start
mongoose.connect(process.env.MONGO_URI, {
     useNewUrlParser: true,
     useUnifiedTopology: true
})
     .then(() => {
          console.log('Connected to MongoDB');
          const PORT = process.env.PORT || 3000;
          server.listen(PORT, () => {
               console.log(`Server running on port ${PORT}`);
          });
     })
     .catch((error) => {
          console.error('MongoDB connection error:', error);
          process.exit(1);
     });

// Graceful shutdown
process.on('SIGTERM', () => {
     console.log('SIGTERM received. Shutting down gracefully');
     server.close(() => {
          mongoose.connection.close(false, () => {
               console.log('MongoDB connection closed');
               process.exit(0);
          });
     });
});

module.exports = app;