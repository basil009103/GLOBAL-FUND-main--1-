// backend/models/Campaign.js

const mongoose = require("mongoose");

const campaignSchema = new mongoose.Schema(
  {
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

    collected: {
      // Tracks how much has been raised so far
      type: Number,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      enum: ["PKR", "USD"], // extend later if you want multi-currency
    },

    deadline: {
      type: Date,
      required: true,
    },

    urgency: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
      required: true,
    },

    beneficiaryInfo: {
      type: String,
      required: true,
      trim: true,
    },

    walletOptions: {
      // Wallets available for donations (like JazzCash, PayPal, Easypaisa)
      type: [String],
      default: [],
    },

    phoneNumber: {
      // Contact phone number for the campaign (11 digits)
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{11}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid 11-digit phone number!`,
      },
    },

    status: {
      // Campaign lifecycle state
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      required: true,
    },

    createdBy: {
      // Reference to User model
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    createdByEmail: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

const Campaign = mongoose.model("Campaign", campaignSchema);

module.exports = Campaign;
