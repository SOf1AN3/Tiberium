import bcrypt from 'bcrypt';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { generateToken } from '../../../lib/auth';

export default async function handler(req, res) {
   if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
   }

   try {
      await dbConnect();
   } catch (error) {
      console.error('Database connection error:', error);
      return res.status(500).json({ error: 'Database connection failed' });
   }

   const { email, password, rester } = req.body;

   try {
      // Validate input
      if (!email || !password) {
         return res.status(400).json({ error: 'Email and password are required' });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken(user._id, rester ? '7d' : '24h');

      // Return token and user info (without password)
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
}
