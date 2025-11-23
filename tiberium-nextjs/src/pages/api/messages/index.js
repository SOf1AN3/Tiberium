import dbConnect from '../../../lib/dbConnect';
import Message from '../../../models/Message';
import { authenticateRequest } from '../../../lib/auth';

export default async function handler(req, res) {
   await dbConnect();

   try {
      const user = await authenticateRequest(req);

      if (req.method === 'GET') {
         // Get all conversations for the authenticated user
         const messages = await Message.find({
            $or: [{ senderId: user._id }, { receiverId: user._id }]
         }).populate('senderId receiverId', 'name email');

         return res.json(messages);
      }

      if (req.method === 'POST') {
         // Create a new message
         const { receiverId, content } = req.body;

         if (!receiverId || !content) {
            return res.status(400).json({ error: 'Receiver ID and content are required' });
         }

         const newMessage = new Message({
            senderId: user._id,
            receiverId,
            content: content.trim(),
            timestamp: new Date(),
            seen: false
         });

         await newMessage.save();

         // Populate sender and receiver info
         await newMessage.populate('senderId receiverId', 'name email');

         return res.status(201).json(newMessage);
      }

      return res.status(405).json({ error: 'Method not allowed' });
   } catch (error) {
      console.error('Messages API error:', error);
      res.status(401).json({ error: error.message || 'Authentication failed' });
   }
}
