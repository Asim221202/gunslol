const router = require("express").Router();
const passport = require("passport");

// Google ile giriş başlat
router.get("/google", passport.authenticate("google", {
  scope: ["profile"],
}));

// Google'dan dönüş (callback)
router.get("/google/callback", passport.authenticate("google", {
  failureRedirect: "/",
}), (req, res) => {
  res.redirect("/profile");
});

// Çıkış
router.get("/logout", (req, res) => {
  req.logout(err => {
    if (err) console.error(err);
    res.redirect("/");
  });
});

module.exports = router;
