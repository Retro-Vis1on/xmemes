const mongoose = require("mongoose");
const schema = new mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  caption: { type: String, required: true },
  like: { type: Number, default: 0 },
  date: { type: String },
  time: { type: Number },
});
const Meme = mongoose.model("Meme", schema);
module.exports = Meme;
