const request = require('supertest');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const authRoutes = require('../routes/auth');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);

// Mock bcrypt and jwt
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../models/user');

describe('Auth Routes', () => {
   beforeEach(() => {
      jest.clearAllMocks();
   });

   describe('POST /auth/signup', () => {
      it('should create a new user', async () => {
         bcrypt.hash.mockResolvedValue('hashedPassword');
         User.prototype.save.mockResolvedValue();

         const response = await request(app)
            .post('/auth/signup')
            .send({ name: 'Test User', email: 'test@example.com', password: 'password' });

         expect(response.status).toBe(201);
         expect(response.body).toEqual({ message: 'User created successfully' });
      });

      it('should handle errors', async () => {
         bcrypt.hash.mockRejectedValue(new Error('Error hashing password'));

         const response = await request(app)
            .post('/auth/signup')
            .send({ name: 'Test User', email: 'test@example.com', password: 'password' });

         expect(response.status).toBe(400);
         expect(response.body).toEqual({ error: 'Error creating user' });
      });
   });

   describe('POST /auth/login', () => {
      it('should login a user', async () => {
         const mockUser = {
            _id: 'userId',
            email: 'test@example.com',
            password: 'hashedPassword',
            toObject: jest.fn().mockReturnValue({ _id: 'userId', email: 'test@example.com' })
         };
         User.findOne.mockResolvedValue(mockUser);
         bcrypt.compare.mockResolvedValue(true);
         jwt.sign.mockReturnValue('token');

         const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'password' });

         expect(response.status).toBe(200);
         expect(response.body).toEqual({
            token: 'token',
            user: { _id: 'userId', email: 'test@example.com' }
         });
      });

      it('should handle invalid credentials', async () => {
         User.findOne.mockResolvedValue(null);

         const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'password' });

         expect(response.status).toBe(400);
         expect(response.body).toEqual({ error: 'Invalid credentials' });
      });

      it('should handle errors', async () => {
         User.findOne.mockRejectedValue(new Error('Error finding user'));

         const response = await request(app)
            .post('/auth/login')
            .send({ email: 'test@example.com', password: 'password' });

         expect(response.status).toBe(500);
         expect(response.body).toEqual({ error: 'Server error' });
      });
   });
});