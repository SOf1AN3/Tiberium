import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
   throw new Error('Please define the JWT_SECRET environment variable inside .env.local');
}

/**
 * Verify JWT token and return the decoded payload
 * @param {string} token - JWT token
 * @returns {object} Decoded token payload
 */
export function verifyToken(token) {
   try {
      return jwt.verify(token, JWT_SECRET);
   } catch (error) {
      throw new Error('Invalid or expired token');
   }
}

/**
 * Generate JWT token for a user
 * @param {string} userId - User ID
 * @param {string} expiresIn - Token expiration time (default: '24h')
 * @returns {string} JWT token
 */
export function generateToken(userId, expiresIn = '24h') {
   return jwt.sign({ userId }, JWT_SECRET, { expiresIn });
}

/**
 * Middleware to authenticate API requests
 * Usage: const user = await authenticateRequest(req);
 * @param {object} req - Next.js API request object
 * @returns {object} User object (without password)
 */
export async function authenticateRequest(req) {
   const authHeader = req.headers.authorization;

   if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
   }

   const token = authHeader.replace('Bearer ', '');

   try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
         throw new Error('User not found');
      }

      return user;
   } catch (error) {
      throw new Error('Authentication failed: ' + error.message);
   }
}

/**
 * Check if user is admin
 * @param {object} user - User object
 * @returns {boolean}
 */
export function isAdmin(user) {
   return user && user.type === 'admin';
}
