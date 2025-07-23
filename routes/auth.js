const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || "gizli";
const MAIL_USER = process.env.MAIL_USER;
const MAIL_PASS = process.env.MAIL_PASS;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: MAIL_USER,
    pass: MAIL_PASS,
  },
});

// Kayıt - mail doğrulama kodu göndererek
router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username)
    return res.status(400).json({ msg: "Tüm alanlar gerekli" });

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ msg: "Bu email zaten kayıtlı" });

  const hashed = await bcrypt.hash(password, 10);

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 haneli kod
  const verifyExpires = Date.now() + 1000 * 60 * 10; // 10 dakika geçerli

  const user = new User({
    email,
    password: hashed,
    username,
    verifyCode,
    verifyExpires,
    verified: false,
  });

  try {
    await user.save();

    // Mail gönder
    const mailOptions = {
      from: `"Gunslol" <${MAIL_USER}>`,
      to: email,
      subject: "Gunslol Doğrulama Kodu",
      text: `Merhaba ${username},\n\nDoğrulama kodun: ${verifyCode}\nBu kod 10 dakika geçerlidir.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ msg: "Kayıt başarılı, doğrulama kodu gönderildi" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Kayıt sırasında hata oluştu" });
  }
});

// Mail doğrulama kodu kontrolü
router.post("/verify", async (req, res) => {
  const { email, code } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ msg: "Kullanıcı bulunamadı" });

  if (user.verified) return res.json({ msg: "Zaten doğrulanmış" });

  if (user.verifyCode !== code)
    return res.status(400).json({ msg: "Kod yanlış" });

  if (user.verifyExpires < Date.now())
    return res.status(400).json({ msg: "Kod süresi dolmuş" });

  user.verified = true;
  user.verifyCode = undefined;
  user.verifyExpires = undefined;
  await user.save();

  res.json({ msg: "Doğrulama başarılı" });
});

// Giriş (login)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ msg: "Email ve şifre gerekli" });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Kullanıcı bulunamadı" });

  if (!user.verified)
    return res.status(401).json({ msg: "Lütfen önce mailinizi doğrulayın" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ msg: "Şifre yanlış" });

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

  res.json({
    token,
    user: {
      email: user.email,
      username: user.username,
    },
  });
});

module.exports = router;
