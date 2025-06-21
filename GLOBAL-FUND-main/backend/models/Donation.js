const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  amount: { type: Number, required: true, min: 1 },
  currency: { type: String, enum: ['PKR', 'USD'], required: true },
  transactionId: { type: String, required: true },
  method: { type: String, required: true },
  date: { type: Date, default: Date.now },
  donorName: { type: String },
  donorEmail: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);
