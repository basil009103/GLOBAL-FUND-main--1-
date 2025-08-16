const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env file

const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const bcrypt = require('bcryptjs'); // Import bcryptjs

const User = require('./models/User'); // Import your User model

const app = express();

// Middleware
app.use(cors()); // Enables Cross-Origin Resource Sharing
app.use(express.json()); // Parses incoming JSON requests

// Health check endpoint
app.get("/api/test", (req, res) => {
  res.json({ message: "✅ Backend connected successfully!" });
});

// Helper function to generate JWT token
const generateToken = (id, isAdmin) => {
  // Signs a new token with user ID and isAdmin status
  // Uses JWT_SECRET from environment variables for security
  // Token expires in 1 hour
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  });
};

// --- NEW ADMIN LOGIN ROUTE ---
// @desc    Authenticate admin user and get a token
// @route   POST /api/admin/login
// @access  Public
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body; // Extract email and password from request body

  try {
    // Find the user by email in the database
    const user = await User.findOne({ email });

    // Check if user exists and if the provided password matches the hashed password
    if (user && (await user.matchPassword(password))) {
      // Check if the user has admin privileges
      if (user.isAdmin) {
        // If user is found, password matches, and user is an admin, send success response
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id, user.isAdmin), // Generate and send JWT token
        });
      } else {
        // User exists and password is correct, but they are not an admin
        res.status(403).json({ message: '🚫 Not authorized: User is not an admin.' });
      }
    } else {
      // User not found or password does not match
      res.status(401).json({ message: '❌ Invalid email or password.' });
    }
  } catch (error) {
    // Handle any server-side errors during the login process
    console.error("Admin login error:", error);
    res.status(500).json({ message: '⚠️ Server error during login.' });
  }
});

// --- EXISTING ROUTES ---
const userRoutes = require('./routes/userRoutes');
const campaignRoutes = require('./routes/campaignRoutes'); // includes donation route
const donationsRoutes = require('./routes/donations');

app.use('/api/users', userRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationsRoutes);

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/globalfund'; // Fallback URI

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected');
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
});
