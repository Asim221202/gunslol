const nodemailer = require("nodemailer");
const crypto = require("crypto");

router.post("/register", async (req, res) => {
  const { email, password, username } = req.body;
  if (!email || !password || !username)
    return res.status(400).json({ msg: "Tüm alanlar gerekli" });

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(400).json({ msg: "Bu email zaten kayıtlı" });

  const hashed = await bcrypt.hash(password, 10);

  const verifyCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 haneli kod
  const verifyExpires = Date.now() + 1000 * 60 * 10; // 10 dk geçerli

  const user = new User({
    email,
    password: hashed,
    username,
    verifyCode,
    verifyExpires,
    verified: false,
  });

  await user.save();

  // Mail gönder
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Gunslol Bot" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Gunslol Doğrulama Kodu",
    text: `Merhaba ${username},\n\nDoğrulama kodun: ${verifyCode}\nBu kod 10 dakika geçerlidir.`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error("Mail gönderilemedi:", err);
      return res.status(500).json({ msg: "Mail gönderilemedi" });
    }
    return res.json({ msg: "Kayıt başarılı, doğrulama kodu gönderildi" });
  });
});
