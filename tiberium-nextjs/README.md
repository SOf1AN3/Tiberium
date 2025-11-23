# Tiberium Next.js Application

Complete Next.js migration of the Tiberium Consulting platform, combining the original frontend (React + Vite) and backend (Express) into a single Next.js application.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Routes](#api-routes)
- [Authentication](#authentication)
- [Internationalization](#internationalization)
- [Socket.IO Integration](#socketio-integration)
- [Testing](#testing)
- [Deployment](#deployment)
- [Migration Notes](#migration-notes)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This Next.js application integrates:
- **Frontend**: All React components and pages from the original Vite application
- **Backend**: Express API routes converted to Next.js API routes
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JWT-based authentication system
- **Real-time**: Socket.IO for real-time messaging
- **i18n**: Multi-language support (French/English)

## ✨ Features

- ✅ User authentication (signup, login, JWT tokens)
- ✅ Role-based access control (admin, simple, premium, advanced users)
- ✅ Real-time messaging with Socket.IO
- ✅ Internationalization (French & English)
- ✅ Protected routes with client and server-side validation
- ✅ MongoDB integration with Mongoose
- ✅ Responsive design with existing CSS
- ✅ Admin panel for user management

## 📁 Project Structure

```
tiberium-nextjs/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── PrivateRoute.jsx
│   │   ├── AdminRoute.jsx
│   │   └── ...
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication context
│   ├── lib/                 # Utility functions
│   │   ├── dbConnect.js     # MongoDB connection
│   │   └── auth.js          # Authentication utilities
│   ├── models/              # Mongoose models
│   │   ├── User.js
│   │   └── Message.js
│   ├── pages/               # Next.js pages and API routes
│   │   ├── _app.jsx         # Global app wrapper
│   │   ├── index.jsx        # Home page
│   │   ├── about.jsx
│   │   ├── services.jsx
│   │   ├── expats.jsx
│   │   ├── contact.jsx
│   │   ├── connexion.jsx
│   │   ├── inscription.jsx
│   │   ├── chat.jsx
│   │   ├── profile.jsx
│   │   ├── 404.jsx
│   │   ├── admin/
│   │   │   └── index.jsx    # Admin panel
│   │   └── api/             # API routes
│   │       ├── auth/
│   │       │   ├── signup.js
│   │       │   ├── login.js
│   │       │   ├── check.js
│   │       │   └── users.js
│   │       ├── messages/
│   │       │   ├── index.js
│   │       │   └── history/[userId].js
│   │       └── socket.js    # Socket.IO handler
│   └── styles/              # CSS files
│       ├── globals.css      # Global styles
│       ├── about.css
│       ├── connexion.css
│       ├── footer.css
│       └── ...
├── public/
│   ├── assets/              # Images and static files
│   └── locales/             # Translation files
│       ├── en/
│       │   └── translation.json
│       └── fr/
│           └── translation.json
├── .env.local               # Environment variables (create from .env.example)
├── .env.example             # Environment variables template
├── next.config.js           # Next.js configuration
├── next-i18next.config.js   # i18n configuration
├── jsconfig.json            # JavaScript configuration
├── package.json
└── README.md
```

## 🔧 Prerequisites

- Node.js 18+ (recommended)
- npm or yarn
- MongoDB instance (local or cloud like MongoDB Atlas)
- Git

## 📦 Installation

1. **Navigate to the project directory:**
   ```powershell
   cd c:\Users\Sofiane\Desktop\Tiberium\tiberium-nextjs
   ```

2. **Install dependencies:**
   ```powershell
   npm install
   ```

## ⚙️ Configuration

1. **Create environment file:**
   ```powershell
   Copy-Item .env.example .env.local
   ```

2. **Edit `.env.local` with your configuration:**
   ```env
   # MongoDB Connection String
   MONGODB_URI=mongodb://localhost:27017/tiberium
   # Or use MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/tiberium?retryWrites=true&w=majority

   # JWT Secret Key (generate a strong random string)
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

   # Application URL
   NEXT_PUBLIC_APP_URL=http://localhost:3000

   # Environment
   NODE_ENV=development
   ```

3. **Generate a secure JWT secret:**
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## 🚀 Running the Application

### Development Mode

```powershell
npm run dev
```

The application will start on `http://localhost:3000`

### Production Build

```powershell
npm run build
npm run start
```

### Linting

```powershell
npm run lint
```

## 🔌 API Routes

All API routes are under `/api`:

### Authentication Routes
- **POST** `/api/auth/signup` - Register new user
- **POST** `/api/auth/login` - Login user
- **GET** `/api/auth/check` - Verify authentication (requires Bearer token)
- **GET** `/api/auth/users` - Get user list (requires authentication)

### Message Routes
- **GET** `/api/messages` - Get all conversations (requires authentication)
- **POST** `/api/messages` - Create new message (requires authentication)
- **GET** `/api/messages/history/:userId` - Get message history with specific user

### Socket.IO
- **GET** `/api/socket` - Initialize Socket.IO connection

### Example API Usage:

```javascript
// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, rester: true })
});
const { token, user } = await response.json();

// Authenticated request
const response = await fetch('/api/auth/check', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## 🔐 Authentication

### How It Works

1. **Registration**: Users sign up via `/inscription` page
2. **Login**: Users login via `/connexion` page, receiving a JWT token
3. **Token Storage**: 
   - Persistent login: localStorage
   - Session-based: sessionStorage
4. **Protected Routes**: Client-side protection with `PrivateRoute` and `AdminRoute` wrappers
5. **API Protection**: Server-side validation using `authenticateRequest` utility

### User Types
- `simple` - Default user (can message admins)
- `advanced` - Advanced features user
- `premium` - Premium user
- `admin` - Full access to admin panel and all users

### Creating an Admin User

Since the default signup creates `simple` users, you need to manually update a user to admin in MongoDB:

```javascript
// Using MongoDB Shell or Compass
db.users.updateOne(
  { email: "admin@tiberium.com" },
  { $set: { type: "admin" } }
);
```

Or using a script:
```powershell
# Create admin-setup.js in project root
node admin-setup.js
```

## 🌐 Internationalization

The app supports French (default) and English.

### Switching Languages

Users can switch languages using the language button in the header. The language is persisted in cookies and localStorage.

### Adding New Translations

1. Edit `public/locales/en/translation.json`
2. Edit `public/locales/fr/translation.json`
3. Use translations in components:

```jsx
import { useTranslation } from 'next-i18next';

function MyComponent() {
  const { t } = useTranslation();
  return <h1>{t('key_name')}</h1>;
}
```

### Adding New Languages

1. Update `next-i18next.config.js`:
```javascript
module.exports = {
  i18n: {
    locales: ['en', 'fr', 'es'], // Add new locale
    defaultLocale: 'fr',
  },
};
```

2. Create `public/locales/es/translation.json`

## 💬 Socket.IO Integration

Real-time messaging is handled by Socket.IO.

### Client Connection

```javascript
import io from 'socket.io-client';

const socket = io({
  path: '/api/socket',
  auth: { token: getToken() }
});

socket.on('receiveMessage', (message) => {
  console.log('New message:', message);
});

socket.emit('sendMessage', {
  receiverId: '123',
  content: 'Hello!'
});
```

### Socket Events

- `sendMessage` - Send a new message
- `receiveMessage` - Receive incoming message
- `markAsSeen` - Mark messages as read
- `error` - Error handling

## 🧪 Testing

### Run Tests

```powershell
npm test
```

### Test Coverage

```powershell
npm test -- --coverage
```

### Writing Tests

Tests should be created for API routes using Jest and Supertest:

```javascript
// __tests__/api/auth.test.js
import handler from '../../src/pages/api/auth/login';
import { createMocks } from 'node-mocks-http';

describe('/api/auth/login', () => {
  it('should login successfully', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      body: { email: 'test@test.com', password: 'password' }
    });
    
    await handler(req, res);
    expect(res._getStatusCode()).toBe(200);
  });
});
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### Environment Variables for Production

Set these in your deployment platform:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Strong secret key
- `NEXT_PUBLIC_APP_URL` - Your production URL
- `NODE_ENV=production`

### Manual Deployment

```powershell
npm run build
npm run start
```

Use a process manager like PM2:
```powershell
npm install -g pm2
pm2 start npm --name "tiberium" -- start
```

## 📝 Migration Notes

### Changes from Original Project

1. **Routing**: React Router → Next.js routing (`/pages` directory)
2. **API**: Express routes → Next.js API routes (`/pages/api`)
3. **Assets**: `src/assets` → `public/assets` (use `/assets/image.png` paths)
4. **Environment**: `.env` → `.env.local`
5. **i18n**: react-i18next → next-i18next (with `getStaticProps`)
6. **Navigation**: `useNavigate()` → `useRouter()` from `next/router`
7. **Links**: `<a href>` → `<Link href>` from `next/link`

### Files to Complete

Some components need full implementation from the original project:

**High Priority:**
- [ ] `src/pages/chat.jsx` - Full Messages/Chat component with Socket.IO
- [ ] `src/pages/services.jsx` - Services page content and Cards component
- [ ] `src/pages/expats.jsx` - Expats services page
- [ ] `src/pages/contact.jsx` - Contact form with emailjs integration
- [ ] `src/pages/profile.jsx` - Profile settings component
- [ ] `src/pages/admin/index.jsx` - User management (Users, UserList components)

**Components to Port:**
- [ ] `src/components/Cards.jsx`
- [ ] `src/components/LazyImage.jsx`
- [ ] `src/components/Sidebar.jsx`
- [ ] `src/components/ContactForm.jsx`
- [ ] `src/components/UserList.jsx`
- [ ] `src/components/Users.jsx`

**Reference:**
- Original files are in `c:\Users\Sofiane\Desktop\Tiberium\frontend\src`
- Copy component logic and update imports for Next.js

### Database Migration

If migrating from existing database, ensure:
1. User schema matches (especially `type` field: simple/advanced/premium/admin)
2. Message schema is compatible
3. Indexes are created for performance

## 🐛 Troubleshooting

### MongoDB Connection Issues

**Problem**: "MongooseServerSelectionError"

**Solutions**:
- Verify MongoDB is running: `mongod` or check Atlas dashboard
- Check connection string format in `.env.local`
- Ensure IP whitelist in MongoDB Atlas
- Verify network connectivity

### JWT Token Issues

**Problem**: "Invalid or expired token"

**Solutions**:
- Check JWT_SECRET is set in `.env.local`
- Clear localStorage/sessionStorage in browser
- Verify token format: `Bearer <token>`

### Socket.IO Connection Failed

**Problem**: Socket connection refused

**Solutions**:
- Ensure you call `/api/socket` once before connecting
- Check NEXT_PUBLIC_APP_URL matches your dev URL
- Verify token is being passed in auth handshake

### i18n Not Working

**Problem**: Translations not loading

**Solutions**:
- Check `getStaticProps` is included in page component
- Verify translation keys exist in both language files
- Clear `.next` cache: `Remove-Item -Recurse -Force .next; npm run dev`

### Module Not Found

**Problem**: "Module not found: Can't resolve '...'"

**Solutions**:
- Install missing dependency: `npm install <package-name>`
- Check import paths (use `@/` for absolute imports)
- Restart dev server

### Build Errors

**Problem**: Next.js build fails

**Solutions**:
```powershell
# Clear cache and rebuild
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules
npm install
npm run build
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [next-i18next Documentation](https://github.com/i18next/next-i18next)
- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

## 🤝 Contributing

1. Complete remaining component ports (see Migration Notes)
2. Add tests for API routes
3. Improve error handling
4. Add loading states
5. Optimize performance

## 📄 License

Copyright © Tiberium Consulting 2024

---

## Quick Start Commands (Windows)

```powershell
# Initial setup
cd c:\Users\Sofiane\Desktop\Tiberium\tiberium-nextjs
npm install
Copy-Item .env.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret

# Start MongoDB (if local)
mongod

# Run development server
npm run dev

# Open browser
start http://localhost:3000

# Create first admin user (after signup)
# Use MongoDB Compass or shell to update user.type to 'admin'
```

---

**Developed by Myks Studios for Tiberium Consulting**
