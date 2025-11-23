# Quick Start Guide - Tiberium Next.js

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies

```powershell
cd c:\Users\Sofiane\Desktop\Tiberium\tiberium-nextjs
npm install
```

### Step 2: Configure Environment

```powershell
# Copy example environment file
Copy-Item .env.example .env.local

# Edit .env.local with your settings
notepad .env.local
```

**Required settings:**
```env
MONGODB_URI=mongodb://localhost:27017/tiberium
JWT_SECRET=your_generated_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Generate a secure JWT secret:**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**
```powershell
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env.local`

### Step 4: Run the App

```powershell
npm run dev
```

🎉 Open http://localhost:3000

### Step 5: Create Admin User

```powershell
node scripts/create-admin.js
```

**Default admin credentials:**
- Email: `admin@tiberium.com`
- Password: `admin123`

⚠️ **Change this password after first login!**

---

## 📝 Common Tasks

### Create a New User Account
1. Go to http://localhost:3000/inscription
2. Fill in the form
3. Click "S'inscrire"
4. Login at http://localhost:3000/connexion

### Access Admin Panel
1. Login with admin account
2. Navigate to http://localhost:3000/admin

### Test the API

**Using PowerShell:**
```powershell
# Signup
$body = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/auth/signup" -Method POST -Body $body -ContentType "application/json"

# Login
$body = @{
    email = "test@example.com"
    password = "password123"
    rester = $true
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method POST -Body $body -ContentType "application/json"
$token = $response.token

# Check auth
$headers = @{
    "Authorization" = "Bearer $token"
}
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/check" -Headers $headers
```

---

## 🔧 Troubleshooting

### Port Already in Use

```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
npm run dev -- -p 3001
```

### MongoDB Not Running

```powershell
# Check if MongoDB is running
Get-Process mongod

# Start MongoDB (if installed locally)
mongod --dbpath C:\data\db
```

### Clear Cache and Restart

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

---

## 📦 Build for Production

```powershell
npm run build
npm run start
```

---

## 🧪 Run Tests

```powershell
npm test
```

---

## 📚 Next Steps

1. **Port remaining components** - See README.md "Migration Notes" section
2. **Complete page implementations** - Services, Expats, Contact, Chat, Profile, Admin
3. **Add more tests** - API routes and components
4. **Customize styling** - Update CSS in `src/styles/`
5. **Deploy** - Follow deployment guide in README.md

---

## 🆘 Need Help?

- Check the full README.md for detailed documentation
- Review the troubleshooting section
- Check MongoDB logs for database issues
- Inspect browser console for client-side errors
- Use MongoDB Compass to view/edit database directly

---

**Happy coding! 🎉**
