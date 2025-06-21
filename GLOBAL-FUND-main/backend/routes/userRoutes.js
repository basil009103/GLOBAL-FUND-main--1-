const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import your User model
const jwt = require('jsonwebtoken'); // Import jsonwebtoken for token generation
const { protect, authorizeAdmin } = require('../middleware/authMiddleware'); // Import middleware
const crypto = require('crypto'); // NEW: Import Node.js built-in crypto module
const nodemailer = require('nodemailer'); // NEW: Import Nodemailer

// Helper function to generate JWT token
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });
};

// NEW: Actual Email Sending Function using Nodemailer
const sendEmail = async (options) => {
  // 1. Create a transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10), // Ensure port is a number
    secure: process.env.EMAIL_SECURE === 'true', // true for 465 (SSL/TLS), false for other ports (STARTTLS)
    auth: {
      user: process.env.EMAIL_USER, // Your email address from .env
      pass: process.env.EMAIL_PASSWORD, // Your email password/App Password from .env
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: process.env.EMAIL_FROM, // Sender address from .env
    to: options.email,            // Recipient email
    subject: options.subject,     // Email subject
    html: options.message,        // HTML body content
  };

  // 3. Send the email
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${options.email}`);
  } catch (error) {
    console.error(`Error sending email to ${options.email}:`, error);
    throw new Error('Failed to send email.'); // Re-throw to be caught by route handler
  }
};

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
router.post('/', async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please enter name, email, and password.' });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const user = new User({
      name,
      email,
      password, // Password will be hashed by pre-save hook in User model
      phone,
      isAdmin: false // Ensure new registrations are NOT admins by default
    });

    const createdUser = await user.save();
    // After successful registration, automatically log them in by sending a token
    res.status(201).json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      phone: createdUser.phone,
      isAdmin: createdUser.isAdmin,
      token: generateToken(createdUser._id, createdUser.isAdmin), // Generate token for new user
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: `Server error during registration: ${error.message}` });
  }
});

// --- NEW ROUTE: User Login ---
// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });

    // If user exists and password matches the hashed password
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id, user.isAdmin), // Generate and send JWT token
      });
    } else {
      // User not found or password does not match
      res.status(401).json({ message: '❌ Invalid email or password.' });
    }
  } catch (error) {
    console.error("User login error:", error);
    res.status(500).json({ message: '⚠️ Server error during login.' });
  }
});

// --- NEW: Forgot Password - Request OTP ---
// @desc    Request OTP for password reset
// @route   POST /api/users/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      // Send a generic success message even if user not found to prevent email enumeration attacks
      return res.status(200).json({ message: 'If a user with that email exists, an OTP has been sent.' });
    }

    // Generate a 6-digit OTP (using crypto)
    const otp = crypto.randomBytes(3).toString('hex').slice(0,6).toUpperCase(); // Example: random 6-digit hex string

    // Set OTP expiration (e.g., 10 minutes from now)
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save(); // Save OTP and expiration to user document

    // Send OTP to user's email (using the actual sendEmail function)
    await sendEmail({
      email: user.email,
      subject: 'Password Reset OTP for Global Fund Raising',
      message: `Your OTP for password reset is: ${otp}. This OTP is valid for 10 minutes.`,
    });

    res.status(200).json({ message: 'OTP sent to your email.' });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: `Failed to send OTP: ${error.message}` });
  }
});

// --- NEW: Reset Password - Verify OTP and Set New Password ---
// @desc    Reset user password with OTP
// @route   POST /api/users/reset-password
// @access  Public
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid request: User not found.' });
    }

    // Check if OTP matches and is not expired
    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }

    // Update password (pre-save hook will hash it)
    user.password = newPassword;
    user.otp = undefined;       // Clear OTP
    user.otpExpires = undefined; // Clear OTP expiration

    await user.save(); // Save the new password and clear OTP fields

    res.status(200).json({ message: 'Password has been reset successfully. You can now login.' });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: `Failed to reset password: ${error.message}` });
  }
});


// @desc    Get user profile (example: can be used by logged-in user to view their own profile)
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  // req.user is populated by the protect middleware
  const user = await User.findById(req.user._id).select('-password'); // Exclude password
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});


// --- ADMIN-SPECIFIC ROUTE TO UPDATE USER (INCLUDING isAdmin STATUS) ---
// @desc    Update any user's details (Admin only)
// @route   PATCH /api/users/:id
// @access  Private/Admin
router.patch('/:id', protect, authorizeAdmin, async (req, res) => {
  const { name, email, password, phone, isAdmin } = req.body;

  try {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;

      // Only update password if provided
      if (password) {
        user.password = password; // Pre-save hook will hash this
      }

      // ONLY ALLOW ADMIN TO CHANGE isAdmin STATUS
      if (typeof isAdmin === 'boolean') {
        user.isAdmin = isAdmin;
      } else if (typeof isAdmin !== 'undefined') {
        return res.status(400).json({ message: 'isAdmin must be a boolean value.' });
      }

      const updatedUser = await user.save(); // Save the updated user

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: `Server error during user update: ${error.message}` });
  }
});


module.exports = router;