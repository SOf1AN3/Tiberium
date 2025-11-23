const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const Message = require('../models/message');
const User = require('../models/user');
const messagesRouter = require('./messages');

// backend/routes/messages.test.js

const appTest = express();
app.use(express.json());
app.use('/messages', messagesRouter);

// Mock auth middleware
jest.mock('../middleware/authMiddleware', () => jest.fn((req, res, next) => {
   req.user = { id: 'userId1', _id: 'userId1' };
   next();
}));

// Mock Message model
jest.mock('../models/message');
jest.mock('../models/user');

// backend/routes/messages.test.js

const app = express();
app.use(express.json());
app.use('/messages', messagesRouter);

// Mock auth middleware
jest.mock('../middleware/authMiddleware', () => jest.fn((req, res, next) => {
   req.user = { id: 'userId1', _id: 'userId1' };
   next();
}));

// Mock Message model
jest.mock('../models/message');
jest.mock('../models/user');

describe('Messages Routes', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe('GET /messages/conversations', () => {
      it('should return a list of messages for the authenticated user', async () => {
         const mockMessages = [
            { senderId: { name: 'User1', email: 'user1@example.com' }, receiverId: { name: 'User2', email: 'user2@example.com' }, content: 'Hello' }
         ];
         Message.find.mockResolvedValue(mockMessages);

         const response = await request(app).get('/messages/conversations');

         expect(response.status).toBe(200);
         expect(response.body).toEqual(mockMessages);
      });

      it('should handle server errors', async () => {
         Message.find.mockRejectedValue(new Error('Server error'));

         const response = await request(app).get('/messages/conversations');

         expect(response.status).toBe(500);
         expect(response.body).toEqual({ error: 'Server error' });
      });
   });

   describe('GET /messages/history/:userId', () => {
      it('should return the message history between the authenticated user and the specified user', async () => {
         const mockMessages = [
            { senderId: { name: 'User1', email: 'user1@example.com' }, receiverId: { name: 'User2', email: 'user2@example.com' }, content: 'Hello' }
         ];
         Message.find.mockResolvedValue(mockMessages);

         const response = await request(app).get('/messages/history/userId2');

         expect(response.status).toBe(200);
         expect(response.body).toEqual(mockMessages);
      });

      it('should handle server errors', async () => {
         Message.find.mockRejectedValue(new Error('Server error'));

         const response = await request(app).get('/messages/history/userId2');

         expect(response.status).toBe(500);
         expect(response.body).toEqual({ error: 'Server error' });
      });

      it('should return 404 if user ID does not exist', async () => {
         Message.find.mockResolvedValue([]);
         const response = await request(app).get('/messages/history/nonexistentUserId');
         expect(response.status).toBe(404);
         expect(response.body).toEqual({ error: 'User not found' });
      });
   });

   describe('POST /messages', () => {
      it('should create a new message and return it', async () => {
         const newMessage = { senderId: 'userId1', receiverId: 'userId2', content: 'Hello', timestamp: new Date() };
         Message.prototype.save.mockResolvedValue(newMessage);

         const response = await request(app)
            .post('/messages')
            .send({ receiverId: 'userId2', content: 'Hello' });

         expect(response.status).toBe(201);
         expect(response.body).toEqual(newMessage);
      });

      it('should handle server errors', async () => {
         Message.prototype.save.mockRejectedValue(new Error('Error saving message'));

         const response = await request(app)
            .post('/messages')
            .send({ receiverId: 'userId2', content: 'Hello' });

         expect(response.status).toBe(500);
         expect(response.body).toEqual({ error: 'Error saving message' });
      });

      it('should return 400 if required fields are missing', async () => {
         const response = await request(app)
            .post('/messages')
            .send({ content: 'Hello' });

         expect(response.status).toBe(400);
         expect(response.body).toEqual({ error: 'Receiver ID is required' });
      });
   });

   describe('Unauthorized Access', () => {
      it('should return 401 if user is not authenticated', async () => {
         authMiddleware.mockImplementationOnce((req, res, next) => {
            res.status(401).json({ error: 'Unauthorized' });
         });

         const response = await request(app).get('/messages/conversations');

         expect(response.status).toBe(401);
         expect(response.body).toEqual({ error: 'Unauthorized' });
      });
   });
});