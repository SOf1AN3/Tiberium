import dbConnect from '../../../lib/dbConnect';
import User from '../../../models/User';
import { authenticateRequest } from '../../../lib/auth';

export default async function handler(req, res) {
   if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
   }

   await dbConnect();

   try {
      const currentUser = await authenticateRequest(req);

      let users;

      // If user is admin, return all users except themselves
      if (currentUser.type === 'admin') {
         users = await User.find(
            { _id: { $ne: currentUser._id } },
            { password: 0 } // Exclude password
         );
      }
      // If user is normal, return only admins
      else {
         users = await User.find(
            {
               type: 'admin',
               _id: { $ne: currentUser._id }
            },
            { password: 0 }
         );
      }

      // Sort users by type (admins first) then by name
      users.sort((a, b) => {
         if (a.type === 'admin' && b.type !== 'admin') return -1;
         if (a.type !== 'admin' && b.type === 'admin') return 1;
         return a.name.localeCompare(b.name);
      });

      res.json(users);
   } catch (error) {
      console.error('Get users error:', error);
      res.status(401).json({ error: error.message || 'Authentication failed' });
   }
}
