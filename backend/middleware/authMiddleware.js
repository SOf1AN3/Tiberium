const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
   try {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
         return res.status(401).json({ error: 'No token, authorization denied' });
      }

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur complet depuis la base de données
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
         return res.status(401).json({ error: 'User not found' });
      }

      // Mettre l'utilisateur complet dans la requête
      req.user = user;
      next();
   } catch (error) {
      if (error.name === 'JsonWebTokenError') {
         return res.status(401).json({ error: 'Token is not valid' });
      }
      if (error.name === 'TokenExpiredError') {
         return res.status(401).json({ error: 'Token has expired' });
      }
      console.error('Auth middleware error:', error);
      res.status(500).json({ error: 'Server error' });
   }
};

module.exports = authMiddleware;