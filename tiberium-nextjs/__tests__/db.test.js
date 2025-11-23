const dbConnect = require('../src/lib/dbConnect');
const User = require('../src/models/User');
const Message = require('../src/models/Message');

describe('Database Connection', () => {
   beforeAll(async () => {
      await dbConnect();
   });

   it('should connect to database', async () => {
      const conn = await dbConnect();
      expect(conn).toBeDefined();
   });

   it('should create a user', async () => {
      const testUser = {
         name: 'Test User',
         email: `test${Date.now()}@test.com`,
         password: 'hashedpassword',
         type: 'simple'
      };

      const user = new User(testUser);
      await user.save();

      expect(user._id).toBeDefined();
      expect(user.email).toBe(testUser.email);

      // Cleanup
      await User.deleteOne({ _id: user._id });
   });

   it('should create a message', async () => {
      // Create test users first
      const sender = new User({
         name: 'Sender',
         email: `sender${Date.now()}@test.com`,
         password: 'password',
         type: 'simple'
      });
      await sender.save();

      const receiver = new User({
         name: 'Receiver',
         email: `receiver${Date.now()}@test.com`,
         password: 'password',
         type: 'simple'
      });
      await receiver.save();

      const message = new Message({
         senderId: sender._id,
         receiverId: receiver._id,
         content: 'Test message'
      });
      await message.save();

      expect(message._id).toBeDefined();
      expect(message.content).toBe('Test message');

      // Cleanup
      await Message.deleteOne({ _id: message._id });
      await User.deleteOne({ _id: sender._id });
      await User.deleteOne({ _id: receiver._id });
   });
});
