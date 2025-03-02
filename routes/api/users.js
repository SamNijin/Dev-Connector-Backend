const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const keys = require("../../config/keys");
const passport = require("passport");
const {
  validateRegistration,
  validateLogin,
} = require("../../validation/user");

// @route GET /api/v1/users/test
// @desc Tests users route
// @access Public

router.get("/test", (req, res) => res.json({ msg: "Test success" }));

// @route POST /api/v1/users/register
// @desc User registration
// @access Public

router.post("/registration", async (req, res) => {
  // Add async here
  const { errors, isValid } = validateRegistration(req.body);
  if (!isValid) return res.status(400).json(errors);

  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(409).json({
        message: `A user with this email ${req.body.email} already exists.`,
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);
    newUser.password = hashedPassword;

    const savedUser = await newUser.save();
    res.status(201).json({
      message: `User created: ${savedUser.name}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An error occurred while creating the user.",
      error: error.message,
    });
  }
});

// @route POST /api/v1/users/login
// @desc User Login / Return JWT Token
// @access Public

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLogin(req.body);
  if (!isValid) return res.status(400).json(errors);

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    bcrypt.compare(password, user.password).then((isMatched) => {
      if (!isMatched) {
        return res.status(401).json({ message: "Unauthorized access" });
      }

      const payload = {
        role: "user",
        id: user.id,
        name: user.name,
        email: user.email,
      };

      jwt.sign(
        payload,
        keys.userSecret,
        { expiresIn: 1800 },
        (error, token) => {
          res.status(200).json({
            loginStatus: true,
            message: "login success",
            userToken: `Bearer ${token}`,
          });
        }
      );
    });
  });
});

// @route POST /api/v1/users/profile
// @desc Authenticate user / Return profile
// @access Private

router.get(
  "/get-user",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
