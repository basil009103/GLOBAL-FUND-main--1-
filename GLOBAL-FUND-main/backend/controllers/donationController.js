const Campaign = require("../models/Campaign");
const Donation = require("../models/Donation");

// POST /api/campaigns/:id/donate
exports.donateToCampaign = async (req, res) => {
  const { id } = req.params;
  const { amount, currency, transactionId, paymentMethod, method, donorName, donorEmail } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: "Invalid donation amount" });
  }

  try {
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    // Create donation record
    const donation = new Donation({
      campaignId: campaign._id,
      amount: Number(amount),
      currency: currency || campaign.currency,
      transactionId:
        transactionId ||
        Math.random().toString(36).substring(2, 12).toUpperCase(),
      // ✅ allow paymentMethod (frontend) or fallback to method
      method: paymentMethod || method || "unknown",
      donorName: donorName || (req.user ? req.user.name : ""),
      donorEmail: donorEmail || (req.user ? req.user.email : ""),
    });

    await donation.save();
    // Update campaign collected amount using atomic $inc to avoid triggering
    // full document validation (some older campaign documents may be missing
    // required fields like createdBy/createdByEmail or have enum casing issues).
    // This prevents Mongoose from throwing validation errors on save.
    if (!campaign.createdBy || !campaign.createdByEmail) {
      console.warn(`Campaign ${campaign._id} is missing createdBy/createdByEmail. Donation will still be applied but consider cleaning the campaign document.`);
    }

    const updatedCampaign = await Campaign.findByIdAndUpdate(
      id,
      { $inc: { collected: Number(amount) } },
      { new: true }
    );

    // ✅ Calculate donation progress (%)
    const progress = ((updatedCampaign.collected / updatedCampaign.goal) * 100).toFixed(2);

    res.status(201).json({
      message: "Donation recorded",
      donation,
      updatedCampaign,
      progress: `${progress}%`,
    });
  } catch (error) {
    console.error("Donation error:", error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((v) => v.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: "Server error" });
  }
};
