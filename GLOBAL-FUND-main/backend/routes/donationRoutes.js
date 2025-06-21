const express = require("express");
const router = express.Router();
const { donateToCampaign } = require("../controllers/donationController");

router.post("/campaigns/:id/donate", donateToCampaign);

module.exports = router;
