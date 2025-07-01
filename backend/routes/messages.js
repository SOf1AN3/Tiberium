const express = require('express');
const auth = require('../middleware/authMiddleware');
const User = require('../models/user');
const mongoose = require('mongoose');
const Message = require('../models/message');
const router = express.Router();

router.get('/conversations', auth, async (req, res) => {
   try {
      const messages = await Message.find({
         $or: [{ senderId: req.user.id }, { receiverId: req.user.id }]
      }).populate('senderId receiverId', 'name email');
      res.json(messages);
   } catch (error) {
      res.status(500).json({ error: 'Server error' });
   }
});

router.get('/history/:userId', auth, async (req, res) => {
   try {
      const userId = req.params.userId;
      // Ajout de logs pour le débogage
      console.log('User ID from params:', userId);
      console.log('Authenticated user:', req.user);

      // Vérification des ObjectId
      if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(req.user.id)) {
         return res.status(400).json({ error: 'Invalid user ID format' });
      }

      const messages = await Message.find({
         $or: [
            { senderId: req.user.id, receiverId: userId },
            { senderId: userId, receiverId: req.user.id }
         ]
      })
         .sort({ timestamp: 1 })
         .populate('senderId receiverId', 'name email');

      // Log des messages trouvés

      res.json(messages);
   } catch (error) {
      // Log détaillé de l'erreur
      console.error('Detailed error:', error);
      res.status(500).json({
         error: 'Server error',
         details: error.message
      });
   }
});

// Ajouter cette nouvelle route POST
router.post('/', auth, async (req, res) => {
   try {
      const { receiverId, content } = req.body;

      // Validation et sanitization
      if (!receiverId || !content) {
         return res.status(400).json({ error: 'Receiver ID and content are required' });
      }

      const sanitizedContent = content.trim();
      if (sanitizedContent.length === 0) {
         return res.status(400).json({ error: 'Message content cannot be empty' });
      }
      if (sanitizedContent.length < 1) {
         return res.status(400).json({ error: 'Message must be at least 1 character long' });
      }
      if (sanitizedContent.length > 1000) {
         return res.status(400).json({ error: 'Message cannot exceed 1000 characters' });
      }

      // Filter inappropriate content
      const forbiddenWords = ['spam', 'abuse', 'hate', 'harassment'];
      const containsForbidden = forbiddenWords.some(word =>
         sanitizedContent.toLowerCase().includes(word.toLowerCase())
      );
      if (containsForbidden) {
         return res.status(400).json({ error: 'Message contains inappropriate content' });
      }

      // Check if receiver exists
      const receiver = await User.findById(receiverId);
      if (!receiver) {
         return res.status(404).json({ error: 'Receiver not found' });
      }

      const newMessage = new Message({
         senderId: req.user._id,
         receiverId,
         content: sanitizedContent,
         timestamp: new Date()
      });

      await newMessage.save();
      res.status(201).json(newMessage);
   } catch (error) {
      console.error('Error saving message:', error);
      res.status(500).json({ error: 'Error saving message' });
   }
});



module.exports = router;