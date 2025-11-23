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
      const newMessage = new Message({
         senderId: req.user._id,
         receiverId,
         content,
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