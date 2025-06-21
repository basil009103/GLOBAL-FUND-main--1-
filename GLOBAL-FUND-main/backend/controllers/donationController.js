const Campaign = require("../models/campaign");

// POST /api/campaigns/:id/donate
exports.donateToCampaign = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    campaign.goal = Math.max(campaign.goal - amount, 0);
    await campaign.save();

    res.status(200).json({
      message: "Donation successful",
      updatedGoal: campaign.goal,
    });
  } catch (error) {
    console.error("Donation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
