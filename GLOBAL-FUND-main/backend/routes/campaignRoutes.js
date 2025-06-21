const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign'); // Import your Campaign model
const { protect, authorizeAdmin } = require('../middleware/authMiddleware'); // Import the authentication and authorization middleware
const multer = require('multer'); // NEW: Import multer

// Configure Multer for file storage
// For now, we'll use memory storage. For production, you'd use diskStorage
// or a cloud storage solution like Cloudinary.
const storage = multer.memoryStorage(); // Store file in memory as a buffer
const upload = multer({ storage: storage });

// --- Public Routes ---

// @desc    Get all campaigns
// @route   GET /api/campaigns
// @access  Public
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find({});
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ message: 'Server error while fetching campaigns.' });
  }
});

// @desc    Get a single campaign by ID
// @route   GET /api/campaigns/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (campaign) {
      res.json(campaign);
    } else {
      res.status(404).json({ message: 'Campaign not found' });
    }
  } catch (error) {
    console.error("Error fetching single campaign:", error);
    res.status(500).json({ message: 'Server error while fetching campaign.' });
  }
});

// --- Protected Routes (require 'protect' middleware) ---

// @desc    Create a new campaign
// @route   POST /api/campaigns
// @access  Private (requires user to be logged in)
// NEW: Add 'upload.single('image')' middleware to parse the image file and form fields
router.post('/', protect, upload.single('image'), async (req, res) => {
  // After multer, fields are in req.body and file is in req.file
  const { title, description, goal, currency, deadline, urgency, beneficiaryInfo } = req.body;
  const walletOptions = req.body.walletOptions; // walletOptions will be an array if multiple, or string if single or undefined
  const imageFile = req.file; // The uploaded image file (if any)

  // Basic validation: Check required fields based on your Campaign schema
  // Note: walletOptions is removed from this initial check as it's optional
  if (!title || !description || !goal || !currency || !deadline || !urgency || !beneficiaryInfo) {
    // If any required field is missing after multer parsing, return error
    return res.status(400).json({ message: 'Please fill all required fields for the campaign.' });
  }

  // Handle walletOptions: Multer might parse it as a string if only one checkbox is selected,
  // or an array if multiple, or undefined if none. Ensure it's an array for schema.
  let parsedWalletOptions = [];
  if (walletOptions) {
      if (Array.isArray(walletOptions)) {
          parsedWalletOptions = walletOptions;
      } else if (typeof walletOptions === 'string') {
          // If only one checkbox selected, multer might send it as a string. Convert to array.
          parsedWalletOptions = [walletOptions];
      }
  }

  // Placeholder for imageUrl
  let imageUrl = '';
  if (imageFile) {
    // In a real application, you would upload imageFile.buffer (the image data)
    // to a cloud storage like Cloudinary or AWS S3 here.
    // For now, we'll just acknowledge its presence or set a placeholder.
    console.log(`Image received: ${imageFile.originalname}, Size: ${imageFile.size} bytes`);
    // Example: imageUrl = await uploadToCloudinary(imageFile.buffer);
    imageUrl = `/uploads/${imageFile.originalname}`; // Placeholder URL for now
  }

  try {
    const campaign = new Campaign({
      title,
      description,
      goal: Number(goal), // Ensure goal is converted to a number
      currency,
      deadline,
      urgency,
      beneficiaryInfo,
      walletOptions: parsedWalletOptions, // Use the parsed array
      imageUrl: imageUrl, // Save the image URL/path
      status: 'pending',
      createdBy: req.user._id,
      createdByEmail: req.user.email
    });

    const createdCampaign = await campaign.save();
    res.status(201).json(createdCampaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    // Provide a more specific error message from Mongoose validation if available
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: `Server error during campaign creation: ${error.message}` });
  }
});


// --- Admin-Specific Routes ---

// @desc    Approve a campaign
// @route   PATCH /api/campaigns/:id/approve
// @access  Private/Admin
router.patch('/:id/approve', protect, authorizeAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (campaign) {
      campaign.status = 'approved';
      const updatedCampaign = await campaign.save();
      res.json(updatedCampaign);
    } else {
      res.status(404).json({ message: 'Campaign not found' });
    }
  } catch (error) {
    console.error("Error approving campaign:", error);
    res.status(500).json({ message: 'Server error while approving campaign.' });
  }
});

// @desc    Delete a campaign
// @route   DELETE /api/campaigns/:id
// @access  Private/Admin
router.delete('/:id', protect, authorizeAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (campaign) {
      await campaign.deleteOne();
      res.json({ message: 'Campaign removed successfully' });
    } else {
      res.status(404).json({ message: 'Campaign not found' });
    }
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({ message: 'Server error while deleting campaign.' });
  }
});

module.exports = router;
