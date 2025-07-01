const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
   try {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
         console.log('Auth middleware: No token provided');
         return res.status(401).json({
            error: 'No token, authorization denied',
            code: 'NO_TOKEN'
         });
      }

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur complet depuis la base de données
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
         console.log('Auth middleware: User not found for token');
         return res.status(401).json({
            error: 'User not found',
            code: 'USER_NOT_FOUND'
         });
      }

      // Mettre l'utilisateur complet dans la requête
      req.user = user;
      next();
   } catch (error) {
      console.error('Auth middleware error:', error.message);

      if (error.name === 'JsonWebTokenError') {
         return res.status(401).json({
            error: 'Token is not valid',
            code: 'INVALID_TOKEN'
         });
      }
      if (error.name === 'TokenExpiredError') {
         return res.status(401).json({
            error: 'Token has expired',
            code: 'TOKEN_EXPIRED'
         });
      }

      res.status(500).json({
         error: 'Server error',
         code: 'SERVER_ERROR'
      });
   }
};

module.exports = authMiddleware;