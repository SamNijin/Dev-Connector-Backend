require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const users = require("./routes/users");
const profile = require("./routes/profile");
const posts = require("./routes/posts");

const app = express();

mongoose
  .connect(require("./config/keys").mongoURI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello from Sam"));

app.use("/api/v1/users", users);
app.use("/api/v1/profile", profile);
app.use("/api/v1/posts", posts);

console.log("PORT from .env:", process.env.DB_USER);

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server is running on port ${port}`));
