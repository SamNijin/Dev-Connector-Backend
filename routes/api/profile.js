const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");

const User = require("../../models/User");
const Profile = require("../../models/Profile");

// @route GET /api/v1/profile/test
// @desc Tests profile route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Test success" }));

// @route POST /api/v1/users/profile
// @desc Authenticate user / Return profile
// @access Private

router.get(
  "/get-profile",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const user = User.findById(req.user.id);
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        if (!profile)
          res.status(404).json({
            message: `Profile not found for User ${
              user ? user.name : "Unknown"
            }`,
          });

        res.json(profile);
      })
      .catch((err) => console.log(err));
  }
);

module.exports = router;
