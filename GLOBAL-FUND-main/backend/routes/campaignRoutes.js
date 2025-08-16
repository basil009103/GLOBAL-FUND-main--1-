const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign'); // Import your Campaign model
const { protect, authorizeAdmin } = require('../middleware/authMiddleware'); // Import the authentication and authorization middleware
// removed multer/image handling; campaigns now expect phoneNumber

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
router.post('/', protect, async (req, res) => {
  const { title, description, goal, currency, deadline, urgency, beneficiaryInfo, phoneNumber } = req.body;
  const walletOptions = req.body.walletOptions; // may be array or string or undefined

  // Basic validation: Check required fields based on your Campaign schema
  // Note: walletOptions is removed from this initial check as it's optional
  // Basic required-field validation (normalize values first)
  // Normalize incoming values to reduce user-input validation failures
  const normalizedCurrency = currency ? String(currency).toUpperCase() : undefined;
  const normalizedUrgency = urgency ? String(urgency).toLowerCase() : undefined;
  const parsedDeadline = deadline ? new Date(deadline) : undefined;

  if (!title || !description || !goal || !normalizedCurrency || !parsedDeadline || !normalizedUrgency || !beneficiaryInfo) {
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

  // Basic phone validation server-side
  if (!phoneNumber || !/^\d{11}$/.test(String(phoneNumber))) {
    return res.status(400).json({ message: 'phoneNumber is required and must be 11 digits.' });
  }

  try {
    // Ensure the request is authenticated and we have a user
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: 'Not authorized to create campaigns. Please log in.' });
    }

    // Normalize urgency to match schema enum: ["low","medium","high","critical"]
    const allowedUrgencies = ["low", "medium", "high", "critical"];
    const finalUrgency = allowedUrgencies.includes(normalizedUrgency) ? normalizedUrgency : 'medium';

    // Ensure currency matches allowed values
    const allowedCurrencies = ["PKR", "USD"];
    const finalCurrency = allowedCurrencies.includes(normalizedCurrency) ? normalizedCurrency : 'PKR';

    const campaign = new Campaign({
      title,
      description,
      goal: Number(goal), // Ensure goal is converted to a number
      currency: finalCurrency,
      deadline: parsedDeadline,
      urgency: finalUrgency,
      beneficiaryInfo,
      walletOptions: parsedWalletOptions, // Use the parsed array
  phoneNumber: String(phoneNumber),
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

// Add donation route
const donationController = require('../controllers/donationController');
// Create a protected route for creating donation records
router.post('/:id/donate', protect, donationController.donateToCampaign);

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

// @desc    Reject a campaign
// @route   PATCH /api/campaigns/:id/reject
// @access  Private/Admin
router.patch('/:id/reject', protect, authorizeAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (campaign) {
      campaign.status = 'rejected';
      const updatedCampaign = await campaign.save();
      res.json(updatedCampaign);
    } else {
      res.status(404).json({ message: 'Campaign not found' });
    }
  } catch (error) {
    console.error("Error rejecting campaign:", error);
    res.status(500).json({ message: 'Server error while rejecting campaign.' });
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
