const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const io = require('socket.io-client');
const http = require('http');
const User = require('../models/user');
const Message = require('../models/message');

let mongoServer;
let app;
let server;
let socket;

describe('Server Tests', () => {
   beforeAll(async () => {
      // Configuration de la base de données en mémoire
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);

      // Import de l'app après la configuration de la base de données
      app = require('../app');
      server = http.createServer(app);
      server.listen(process.env.PORT || 5000);
   });

   afterAll(async () => {
      await mongoose.disconnect();
      await mongoServer.stop();
      server.close();
   });

   beforeEach(async () => {
      // Nettoyer la base de données avant chaque test
      await User.deleteMany({});
      await Message.deleteMany({});
   });

   describe('Authentication Routes', () => {
      test('POST /auth/register should create a new user', async () => {
         const response = await request(app)
            .post('/auth/register')
            .send({
               name: 'Test User',
               email: 'test@test.com',
               password: 'password123',
               type: 'simple'
            });

         expect(response.status).toBe(201);
         expect(response.body).toHaveProperty('token');
         expect(response.body.user).toHaveProperty('name', 'Test User');
      });

      test('POST /auth/login should login existing user', async () => {
         // Créer un utilisateur d'abord
         const user = new User({
            name: 'Test User',
            email: 'test@test.com',
            password: 'password123',
            type: 'simple'
         });
         await user.save();

         const response = await request(app)
            .post('/auth/login')
            .send({
               email: 'test@test.com',
               password: 'password123'
            });

         expect(response.status).toBe(200);
         expect(response.body).toHaveProperty('token');
      });
   });

   describe('User Management Routes', () => {
      let adminToken;
      let testUser;

      beforeEach(async () => {
         // Créer un admin
         const admin = new User({
            name: 'Admin',
            email: 'admin@test.com',
            password: 'admin123',
            type: 'admin'
         });
         await admin.save();
         adminToken = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET);

         // Créer un utilisateur test
         testUser = new User({
            name: 'Test User',
            email: 'user@test.com',
            password: 'password123',
            type: 'simple'
         });
         await testUser.save();
      });

      test('GET /auth/users should return all users for admin', async () => {
         const response = await request(app)
            .get('/auth/users')
            .set('Authorization', `Bearer ${adminToken}`);

         expect(response.status).toBe(200);
         expect(response.body.users).toHaveLength(2);
      });

      test('PATCH /auth/users/:id/type should update user type', async () => {
         const response = await request(app)
            .patch(`/auth/users/${testUser._id}/type`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ type: 'advanced' });

         expect(response.status).toBe(200);
         expect(response.body.type).toBe('advanced');
      });

      test('DELETE /auth/users/:id should delete user', async () => {
         const response = await request(app)
            .delete(`/auth/users/${testUser._id}`)
            .set('Authorization', `Bearer ${adminToken}`);

         expect(response.status).toBe(200);
         const deletedUser = await User.findById(testUser._id);
         expect(deletedUser).toBeNull();
      });
   });

   describe('Socket.IO Tests', () => {
      let sender;
      let receiver;
      let senderSocket;
      let receiverSocket;

      beforeEach(async () => {
         // Créer deux utilisateurs pour les tests
         sender = new User({
            name: 'Sender',
            email: 'sender@test.com',
            password: 'password123',
            type: 'simple'
         });
         await sender.save();

         receiver = new User({
            name: 'Receiver',
            email: 'receiver@test.com',
            password: 'password123',
            type: 'simple'
         });
         await receiver.save();

         // Configurer les sockets
         senderSocket = io(`http://localhost:${process.env.PORT || 5000}`, {
            'force new connection': true
         });

         receiverSocket = io(`http://localhost:${process.env.PORT || 5000}`, {
            'force new connection': true
         });
      });

      afterEach(() => {
         if (senderSocket.connected) {
            senderSocket.disconnect();
         }
         if (receiverSocket.connected) {
            receiverSocket.disconnect();
         }
      });

      test('should authenticate socket connections', (done) => {
         const token = jwt.sign({ userId: sender._id }, process.env.JWT_SECRET);

         senderSocket.emit('authenticate', token);

         senderSocket.on('error', (error) => {
            done(error);
         });

         setTimeout(() => {
            expect(senderSocket.connected).toBeTruthy();
            done();
         }, 100);
      });

      test('should send and receive messages', (done) => {
         const token = jwt.sign({ userId: sender._id }, process.env.JWT_SECRET);
         senderSocket.emit('authenticate', token);

         const receiverToken = jwt.sign({ userId: receiver._id }, process.env.JWT_SECRET);
         receiverSocket.emit('authenticate', receiverToken);

         receiverSocket.on('receiveMessage', (message) => {
            expect(message.content).toBe('Hello!');
            expect(message.senderId.toString()).toBe(sender._id.toString());
            expect(message.receiverId.toString()).toBe(receiver._id.toString());
            done();
         });

         setTimeout(() => {
            senderSocket.emit('sendMessage', {
               receiverId: receiver._id.toString(),
               content: 'Hello!'
            });
         }, 100);
      });
   });

   describe('Message Routes', () => {
      let userToken;
      let testUser;

      beforeEach(async () => {
         testUser = new User({
            name: 'Test User',
            email: 'test@test.com',
            password: 'password123',
            type: 'simple'
         });
         await testUser.save();
         userToken = jwt.sign({ userId: testUser._id }, process.env.JWT_SECRET);
      });

      test('GET /messages should return user messages', async () => {
         // Créer quelques messages de test
         const message = new Message({
            senderId: testUser._id,
            receiverId: mongoose.Types.ObjectId(),
            content: 'Test message'
         });
         await message.save();

         const response = await request(app)
            .get('/messages')
            .set('Authorization', `Bearer ${userToken}`);

         expect(response.status).toBe(200);
         expect(response.body.messages).toHaveLength(1);
         expect(response.body.messages[0].content).toBe('Test message');
      });
   });
});