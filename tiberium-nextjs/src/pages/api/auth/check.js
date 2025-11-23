import dbConnect from '../../../lib/dbConnect';
import { authenticateRequest } from '../../../lib/auth';

export default async function handler(req, res) {
   if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
   }

   await dbConnect();

   try {
      const user = await authenticateRequest(req);
      res.json({ user });
   } catch (error) {
      console.error('Auth check error:', error);
      res.status(401).json({ error: error.message || 'Authentication failed' });
   }
}
