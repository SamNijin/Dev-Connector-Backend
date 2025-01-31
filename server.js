require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");
// const { passport: userPassport } = ;

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB config
mongoose
  .connect(require("./config/keys").mongoURI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

// Default route
app.get("/", (req, res) => res.send("Hello from Sam"));

// Passport config
app.use(passport.initialize());

// require("./config/user_passport")(passport);
require("./config/userPassport")(passport);

// Routes
app.use("/api/v1/users", users);
app.use("/api/v1/profile", profile);
app.use("/api/v1/posts", posts);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
