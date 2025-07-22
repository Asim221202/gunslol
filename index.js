require("dotenv").config();
const express = require("express");
const session = require("express-session");
const mongoose = require("mongoose");
const passport = require("passport");
const User = require("./models/User");
require("./config/passport");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secretkey",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB bağlantısı başarılı"))
  .catch((err) => console.error("MongoDB bağlantı hatası:", err));

// Google auth rotaları
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

// Ana sayfa
app.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

// Giriş yapmış kullanıcı profili
app.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/");
  res.render("profile", { user: req.user });
});

// Dinamik kullanıcı profili (/kullaniciadi)
app.get("/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) return res.status(404).render("error", { message: "Kullanıcı bulunamadı." });
    res.render("profile", { user });
  } catch (err) {
    console.error(err);
    res.status(500).render("error", { message: "Bir hata oluştu." });
  }
});

// 404
app.use((req, res) => res.status(404).render("error", { message: "Sayfa bulunamadı." }));

app.listen(PORT, () => console.log(`Sunucu ${PORT} portunda çalışıyor...`));
