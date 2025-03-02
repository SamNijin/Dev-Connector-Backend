const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const mongoose = require("mongoose");

const User = mongoose.model("users");

const keys = require("./keys");
const passport = require("passport");

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.userSecret;

module.exports = (passport) => {
  passport.use(
    "jwt",
    new JwtStrategy(opts, (jwtPayload, done) => {
      User.findById(jwtPayload.id)
        .then((user) => {
          if (user) {
            done(null, user);
          } else {
            done(null, false, { message: "Token is not valid or expired" });
          }
        })
        .catch((err) => console.log(err));
    })
  );
};
