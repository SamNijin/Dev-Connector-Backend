const express = require("express");
const router = express.Router();

// @route GET /api/v1/profile/test
// @desc Tests profile route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Test success" }));

module.exports = router;
