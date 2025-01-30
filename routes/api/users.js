const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const User = require("../../models/User");

// @route GET /api/v1/users/test
// @desc Tests users route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Test success" }));

// @route POST /api/v1/users/register
// @desc User registration
// @access Public
router.post("/registration", (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(409).json({
          message: "A user with this email already exists.",
        });
      }

      const avatar = gravatar.url(req.body.email, {
        s: "200", // Size
        r: "pg", // Rating
        d: "mm", // Default
      });

      const newUser = new User({
        ...req.body,
        avatar,
      });

      bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(newUser.password, salt))
        .then((hash) => {
          newUser.password = hash;
          return newUser.save();
        })
        .then((savedUser) => {
          res.status(201).json({
            message: `User created: ${savedUser.name}`,
          });
        })
        .catch((error) => {
          res.status(500).json({
            success: false,
            message: "An error occurred while creating the user.",
            error: error.message,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        success: false,
        message: "Error checking user existence.",
        error: error.message,
      });
    });
});

module.exports = router;
