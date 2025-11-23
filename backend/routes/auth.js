const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Message = require('../models/message');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', async (req, res) => {
   const { name, email, password } = req.body;
   try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
         name,
         email,
         password: hashedPassword,
         type: 'simple' // Valeur par défaut explicite
      });
      await user.save();
      res.status(201).json({ message: 'User created successfully' });
   } catch (error) {
      console.error('Signup error:', error); // Ajoutez un log d'erreur
      res.status(400).json({ error: error.message || 'Error creating user' });
   }
});

// routes/auth.js
// Dans auth.js, la route login devrait ressembler à ceci :
router.post('/login', async (req, res) => {
   try {
      const { email, password, rester } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({ error: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Créer le token avec l'userId
      const token = jwt.sign(
         { userId: user._id },
         process.env.JWT_SECRET,
         { expiresIn: rester ? '7d' : '24h' }
      );

      // Retourner le token et les infos utilisateur (sans le mot de passe)
      const userResponse = user.toObject();
      delete userResponse.password;

      res.json({
         token,
         user: userResponse
      });
   } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error' });
   }
});

// Add the /auth/check endpoint
router.get('/check', authMiddleware, async (req, res) => {
   try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json({ user });
   } catch (error) {
      res.status(500).json({ error: 'Server error' });
   }
});

router.get('/users', authMiddleware, async (req, res) => {
   try {
      let users;
      // Si l'utilisateur est admin, retourner tous les utilisateurs sauf lui-même
      if (req.user.type === 'admin') {
         users = await User.find(
            { _id: { $ne: req.user._id } },
            { password: 0 } // Exclure le mot de passe
         );
      }
      // Si l'utilisateur est normal, retourner uniquement les admins
      else {
         users = await User.find(
            {
               type: 'admin',
               _id: { $ne: req.user._id }
            },
            { password: 0 }
         );
      }

      // Trier les utilisateurs par type (admins en premier) puis par nom
      users.sort((a, b) => {
         if (a.type === 'admin' && b.type !== 'admin') return -1;
         if (a.type !== 'admin' && b.type === 'admin') return 1;
         return a.name.localeCompare(b.name);
      });

      res.json({ users });
   } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error fetching users' });
   }
});

// Route pour récupérer les messages d'une conversation
router.get('/messages/:userId', authMiddleware, async (req, res) => {
   try {
      const otherUserId = req.params.userId;
      const currentUserId = req.user._id;

      // Vérifier si l'utilisateur a le droit d'accéder à ces messages
      const otherUser = await User.findById(otherUserId);
      if (!otherUser) {
         return res.status(404).json({ error: 'User not found' });
      }

      // Vérifier les permissions (admin peut tout voir, utilisateur normal ne peut voir que les conversations avec les admins)
      if (req.user.type !== 'admin' && otherUser.type !== 'admin') {
         return res.status(403).json({ error: 'Unauthorized' });
      }

      const messages = await Message.find({
         $or: [
            { senderId: currentUserId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: currentUserId }
         ]
      }).sort({ timestamp: 1 });

      res.json({ messages });
   } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ error: 'Error fetching messages' });
   }
});

router.patch('/users/:userId/type', authMiddleware, async (req, res) => {
   try {
      // Vérifier que seul un admin peut effectuer cette action
      if (req.user.type !== 'admin') {
         return res.status(403).json({ error: 'Unauthorized' });
      }

      const { userId } = req.params;
      const { type } = req.body;

      // Valider le type - mettre à jour avec les nouveaux types
      if (!['simple', 'advanced', 'premium', 'admin'].includes(type)) {
         return res.status(400).json({ error: 'Invalid user type' });
      }

      // Interdire de modifier son propre compte
      if (userId === req.user._id.toString()) {
         return res.status(403).json({ error: 'Cannot modify your own account' });
      }

      const updatedUser = await User.findByIdAndUpdate(
         userId,
         { type },
         { new: true }
      );

      if (!updatedUser) {
         return res.status(404).json({ error: 'User not found' });
      }

      res.json({ user: updatedUser });
   } catch (error) {
      console.error('Error changing user type:', error);
      res.status(500).json({ error: 'Server error' });
   }
});

router.delete('/users/:userId', authMiddleware, async (req, res) => {
   try {
      // Vérifier que seul un admin peut effectuer cette action
      if (req.user.type !== 'admin') {
         return res.status(403).json({ error: 'Unauthorized' });
      }

      const { userId } = req.params;

      // Interdire de supprimer son propre compte
      if (userId === req.user._id.toString()) {
         return res.status(403).json({ error: 'Cannot delete your own account' });
      }

      // Supprimer d'abord les messages
      await Message.deleteMany({
         $or: [
            { senderId: userId },
            { receiverId: userId }
         ]
      });

      // Puis supprimer l'utilisateur
      const deletedUser = await User.findByIdAndDelete(userId);

      if (!deletedUser) {
         return res.status(404).json({ error: 'User not found' });
      }

      res.json({
         message: 'User and associated messages deleted successfully',
         deletedMessages: await Message.countDocuments({
            $or: [
               { senderId: userId },
               { receiverId: userId }
            ]
         })
      });
   } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Server error' });
   }
});

// Dans routes/auth.js, ajouter ces nouvelles routes

// Route pour changer l'email
router.patch('/change-email', authMiddleware, async (req, res) => {
   try {
      const { newEmail, password } = req.body;
      const user = await User.findById(req.user._id);

      // Vérifier le mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({ error: 'Invalid password' });
      }

      // Vérifier si le nouvel email existe déjà
      const emailExists = await User.findOne({ email: newEmail });
      if (emailExists) {
         return res.status(400).json({ error: 'Email already exists' });
      }

      // Mettre à jour l'email
      user.email = newEmail;
      await user.save();

      res.json({ message: 'Email updated successfully', user });
   } catch (error) {
      console.error('Change email error:', error);
      res.status(500).json({ error: 'Server error' });
   }
});

// Route pour changer le mot de passe
router.patch('/change-password', authMiddleware, async (req, res) => {
   try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id);

      // Vérifier l'ancien mot de passe
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
         return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // Hasher et enregistrer le nouveau mot de passe
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();

      res.json({ message: 'Password updated successfully' });
   } catch (error) {
      console.error('Change password error:', error);
      res.status(500).json({ error: 'Server error' });
   }
});


module.exports = router;