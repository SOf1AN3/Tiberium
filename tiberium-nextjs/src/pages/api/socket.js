import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import Message from '../../models/Message';
import dbConnect from '../../lib/dbConnect';

const JWT_SECRET = process.env.JWT_SECRET;

const SocketHandler = async (req, res) => {
   if (res.socket.server.io) {
      console.log('Socket.IO already running');
      res.end();
      return;
   }

   console.log('Starting Socket.IO server...');

   const io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
         origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
         methods: ['GET', 'POST'],
         credentials: true,
      },
   });

   res.socket.server.io = io;

   // Connect to database
   await dbConnect();

   // Socket middleware for authentication
   io.use(async (socket, next) => {
      try {
         const token = socket.handshake.auth.token;
         if (!token) {
            return next(new Error('Authentication token required'));
         }

         const decoded = jwt.verify(token, JWT_SECRET);
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

      // Handle sending messages
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

            await message.save();
            await message.populate('senderId receiverId', 'name email');

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

      // Handle marking messages as seen
      socket.on('markAsSeen', async (data) => {
         try {
            const { messageIds } = data;
            await Message.updateMany(
               { _id: { $in: messageIds } },
               { seen: true }
            );
         } catch (error) {
            console.error('Mark as seen error:', error);
         }
      });

      socket.on('disconnect', () => {
         console.log('Client disconnected:', socket.userId);
      });
   });

   console.log('Socket.IO server started');
   res.end();
};

export default SocketHandler;
