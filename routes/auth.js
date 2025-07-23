const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Giriş sayfası
router.get("/login", (req, res) => {
  res.render("login");
});

// Kayıt sayfası
router.get("/register", (req, res) => {
  res.render("register");
});

// Kayıt işlemi
router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, username, password: hashedPassword });
  await user.save();
  res.redirect("/auth/login");
});

// Giriş işlemi
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.send("Kullanıcı bulunamadı");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.send("Şifre yanlış");

  req.login(user, (err) => {
    if (err) return res.send("Giriş başarısız");
    return res.redirect("/profile");
  });
});

module.exports = router;
