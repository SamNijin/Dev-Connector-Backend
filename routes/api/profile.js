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

// @route GET /api/v1/profile/get-profile
// @desc Authenticate user / Return profile
// @access Private

router.get(
  "/get-profile",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id); // Wait for the user to be found
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const profile = await Profile.findOne({ user: req.user.id }); // Wait for the profile to be found
      if (!profile) {
        return res.status(404).json({
          message: `Profile not found for User ${user.name || "Unknown"}`, // Access user.name here
        });
      }

      // If both the user and profile are found
      res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "Error fetching profile or user",
        error: err,
      });
    }
  }
);

// @route POST /api/v1/profile/handle/:handle
// @desc Get user by Handle
// @access Public

router.get("/handle/:handle", async (req, res) => {
  try {
    const profile = await Profile.findOne({ handle: req.params.handle });

    if (profile) {
      return res.status(200).json(profile);
    } else {
      return res.status(404).json({ message: "Profile not found" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Currently we are unable to process this request." });
  }
});

// @route POST /api/v1/profile/user/:user_id
// @desc Get user by ID
// @access Public

router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);

    if (profile) {
      return res.status(200).json(profile);
    } else {
      return res.status(404).json({ message: "Profile not found" });
    }
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Currently we are unable to process this request." });
  }
});

// @route POST /api/v1/profile/all
// @desc Get all profile
// @access Public

router.get("/all", async (req, res) => {
  try {
    const profile = await Profile.find()
      .lean()
      .populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(404).json({ message: "no profile available" });
    }

    return res.status(200).json(profile);
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Currently we are unable to process this request." });
  }
});

// @route POST /api/v1/profile
// @desc Create or Update Profile
// @access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      let profile = {};
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "user not found" });
      } else {
        profile.user = req.user.id;
      }

      if (req.body.handle) {
        profile.handle = req.body.handle;
      }

      if (req.body.company) {
        profile.company = req.body.company;
      }

      if (req.body.website) {
        profile.website = req.body.website;
      }

      if (!req.body.status || req.body.status === undefined) {
        return res.status(400).json({ message: "Status is mandatory" });
      }

      profile.skills = req.body.skills.split(",").map((skill) => skill.trim());
      if (req.body.status) {
        profile.status = req.body.status;
      }

      if (req.body.bio) {
        profile.bio = req.body.bio;
      }
      if (req.body.githubusername) {
        profile.githubusername = req.body.githubusername;
      }

      profile.social = {};

      if (req.body.social) {
        profile.social = { ...req.body.social };
      }
      const userProfile = await Profile.findOne({ user: req.user.id });

      if (userProfile) {
        await Profile.findOneAndUpdate(
          {
            user: req.user.id,
          },
          { $set: profile },
          { new: true }
        );
      } else {
        const profileHandle = await Profile.findOne({ handle: profile.handle });
        if (profileHandle) {
          return res.status(400).json({ message: "The handle exists already" });
        }

        const newProfile = new Profile(profile);
        const saveProfile = await newProfile.save();
        if (saveProfile) {
          return res.json({ message: "profile created / updated" });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// @route POST /api/v1/profile/experience
// @desc Create new experience
// @access Private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        const experience = { ...req.body };
        profile.experience.unshift(experience);

        const savedProfile = profile.save();

        if (savedProfile) {
          return res.status(201).json({ message: "experience created" });
        } else {
          return res.status(400).json({ message: "unable to proceed" });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

// @route POST /api/v1/profile/education
// @desc Create new Education
// @access Private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      if (profile) {
        const education = { ...req.body };
        profile.education.unshift(education);

        const savedProfile = profile.save();

        if (savedProfile) {
          return res.status(201).json({ message: "education created" });
        } else {
          return res.status(400).json({ message: "unable to proceed" });
        }
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
