const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, unique: true }, // /asim gibi profil URL’si için
  bio: { type: String, default: "" },
  avatar: { type: String, default: "" },
  links: [{ name: String, url: String }],
});

module.exports = mongoose.model("User", userSchema);
