// controllers/campaignController.js

const Campaign = require('../models/Campaign');

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json({ success: true, campaigns });
  } catch (error) {
    console.error("❌ Failed to fetch campaigns:", error);
    res.status(500).json({ success: false, error: "Failed to fetch campaigns" });
  }
};
