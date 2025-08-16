const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');

// GET /api/donations - list donations (protected in production)
router.get('/', async (req, res) => {
  try {
    const donations = await Donation.find({}).sort({ createdAt: -1 }).limit(100);
    res.json(donations);
  } catch (err) {
    console.error('Failed to fetch donations:', err);
    res.status(500).json({ message: 'Server error fetching donations' });
  }
});

module.exports = router;
