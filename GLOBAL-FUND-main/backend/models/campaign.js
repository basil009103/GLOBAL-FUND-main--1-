// backend/models/Campaign.js

const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  goal: {
    type: Number,
    required: true,
    min: 0,
  },
  collected: { // NEW FIELD: Tracks the amount collected for the campaign
    type: Number,
    default: 0,
    min: 0,
  },
  currency: {
    type: String,
    required: true,
    enum: ['PKR', 'USD'], // Adjusted based on your provided enum
  },
  deadline: {
    type: Date,
    required: true,
  },
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'], // Retained detailed enum for consistency
    default: 'medium',
    required: true, // Urgency should generally be required
  },
  beneficiaryInfo: {
    type: String,
    required: true,
    trim: true,
  },
  walletOptions: { // Array of selected wallet names/options
    type: [String],
    required: false, // Remains optional to allow empty selection
    default: [],
  },
  imageUrl: { // Changed from 'image' to 'imageUrl' as per your provided snippet
    type: String, // Stores the URL or path to the uploaded image
    required: false, // Image is optional
  },
  status: { // Campaign status: pending, approved, rejected
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending', // New campaigns start as pending
    required: true,
  },
  createdBy: { // Reference to the User who created this campaign (CRUCIAL for auth/tracking)
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdByEmail: { // Storing creator's email for easier display/lookup (CRUCIAL for auth/tracking)
    type: String,
    required: true,
  },
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

const Campaign = mongoose.model('Campaign', campaignSchema);

module.exports = Campaign;