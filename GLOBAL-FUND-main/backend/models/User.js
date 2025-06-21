// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // Import bcryptjs for password hashing and comparison

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String, // or Number
    required: false,
  },
  isAdmin: { // Field to determine if the user is an administrator
    type: Boolean,
    default: false, // By default, a newly created user is not an admin
  },
  
  // NEW: Fields for Password Reset (OTP) functionality
  otp: String,          // Stores the generated OTP string
  otpExpires: Date,     // Stores the expiration timestamp for the OTP
  // END NEW
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps automatically
});

// Middleware to hash the password before saving a new user or updating an existing user's password
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    next();
  }

  // Generate a salt and hash the password
  const salt = await bcrypt.genSalt(10); // 10 is the number of rounds for salting
  this.password = await bcrypt.hash(this.password, salt);
  next(); // Move to the next middleware or save operation
});

// Method to compare entered password with the hashed password in the database
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Use bcrypt.compare to compare the plain text entered password with the hashed password
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;