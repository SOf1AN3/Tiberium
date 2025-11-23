import bcrypt from 'bcrypt';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';

export default async function handler(req, res) {
   if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
   }

   await dbConnect();

   const { name, email, password } = req.body;

   try {
      // Validate input
      if (!name || !email || !password) {
         return res.status(400).json({ error: 'All fields are required' });
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ error: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const user = new User({
         name,
         email,
         password: hashedPassword,
         type: 'simple' // Default user type
      });

      await user.save();

      res.status(201).json({ message: 'User created successfully' });
   } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({ error: error.message || 'Error creating user' });
   }
}
