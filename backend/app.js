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

// Socket events
io.on('connection', (socket) => {
     console.log('Client connected:', socket.userId);

     // Join personal room
     socket.join(socket.userId.toString());

     socket.on('sendMessage', async (data) => {
          try {
               if (!data.receiverId || !data.content) {
                    throw new Error('Missing required message data');
               }

               const message = new Message({
                    senderId: socket.userId,
                    receiverId: data.receiverId,
                    content: data.content.trim(),
                    timestamp: new Date(),
                    seen: false
               });
               console.log('Message:', message);

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
               console.error('Message error:', error);
               socket.emit('error', {
                    type: 'MESSAGE_ERROR',
                    message: error.message
               });
          }
     });

     socket.on('disconnect', () => {
          console.log('Client disconnected:', socket.userId);
     });
});

// Error handling
app.use((err, req, res, next) => {
     console.error(err.stack);
     res.status(500).json({
          error: true,
          message: err.message || 'Internal server error'
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