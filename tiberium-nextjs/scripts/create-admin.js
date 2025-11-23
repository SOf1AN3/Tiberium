const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config({ path: '.env.local' });

// User Schema (matching your model)
const userSchema = new mongoose.Schema({
   name: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   type: {
      type: String,
      enum: ['simple', 'advanced', 'premium', 'admin'],
      default: 'simple'
   },
   isConfirmed: { type: Boolean, default: false }
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

async function createAdminUser() {
   try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');

      // Admin user details
      const adminEmail = 'admin@tiberium.com';
      const adminPassword = 'admin123'; // Change this!
      const adminName = 'Administrator';

      // Check if admin already exists
      const existingAdmin = await User.findOne({ email: adminEmail });

      if (existingAdmin) {
         console.log('Admin user already exists!');
         console.log('Email:', existingAdmin.email);
         console.log('Type:', existingAdmin.type);

         // Update to admin if not already
         if (existingAdmin.type !== 'admin') {
            existingAdmin.type = 'admin';
            await existingAdmin.save();
            console.log('Updated user to admin type');
         }
      } else {
         // Create new admin user
         const hashedPassword = await bcrypt.hash(adminPassword, 10);

         const admin = new User({
            name: adminName,
            email: adminEmail,
            password: hashedPassword,
            type: 'admin',
            isConfirmed: true
         });

         await admin.save();
         console.log('✅ Admin user created successfully!');
         console.log('Email:', adminEmail);
         console.log('Password:', adminPassword);
         console.log('⚠️  IMPORTANT: Change the password after first login!');
      }

      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
   } catch (error) {
      console.error('Error:', error);
      process.exit(1);
   }
}

// Run the script
createAdminUser();
