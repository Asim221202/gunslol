require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const authRoutes = require("./routes/auth");
require("./config/passport");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(session({
  secret: process.env.SESSION_SECRET || "secret",
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected."));

app.use("/auth", authRoutes);

// Ana sayfa
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

// Profil sayfası
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/");
  res.render("profile", { user: req.user });
});

// 404
app.use((req, res) => res.render("error"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
