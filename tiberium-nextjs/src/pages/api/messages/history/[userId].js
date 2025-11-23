import mongoose from 'mongoose';
import dbConnect from '../../../lib/dbConnect';
import Message from '../../../models/Message';
import { authenticateRequest } from '../../../lib/auth';

export default async function handler(req, res) {
   if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
   }

   await dbConnect();

   try {
      const user = await authenticateRequest(req);
      const { userId } = req.query;

      // Validate userId
      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
         return res.status(400).json({ error: 'Invalid user ID format' });
      }

      // Get message history between authenticated user and specified user
      const messages = await Message.find({
         $or: [
            { senderId: user._id, receiverId: userId },
            { senderId: userId, receiverId: user._id }
         ]
      })
         .sort({ timestamp: 1 })
         .populate('senderId receiverId', 'name email');

      res.json(messages);
   } catch (error) {
      console.error('Get message history error:', error);
      res.status(401).json({
         error: error.message || 'Authentication failed',
         details: error.message
      });
   }
}
