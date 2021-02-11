const express = require("express");
const Meme = require("../model/meme");
const timer = require("../public/js/function.js");
const router = express.Router();
const sanitize = require("mongo-sanitize");

const pg_size = 9;

router.use((req, res, next) => {
  const today = new Date();
  const vals = Date().split(" ");
  req.date = vals[2] + " " + vals[1] + ", " + vals[3];
  req.time = today.getTime();
  next();
});

router.get("/", async (req, res) => {
  const memes = await Meme.find({}).sort({ time: -1 }).limit(pg_size);
  const size = memes.length;
  res.render("page.ejs", {
    memes,
    title: "Caption Dis!",
    timer,
    size: size >= 9,
  });
});

router.get("/page/:pg", async (req, res) => {
  let { pg } = req.params;
  let meme = await Meme.find()
    .skip(pg_size * (pg - 1))
    .limit(pg_size)
    .sort({ time: -1 });
  res.send(meme);
});

router.post("/add", async (req, res) => {
  let temp = sanitize(req.body);
  temp.date = req.date;
  temp.time = req.time;
  const newMeme = new Meme(temp);
  await newMeme.save();
  res.redirect(303, "/");
});

router.patch("/edit/:id", async (req, res) => {
  const { url, caption } = req.body;
  const { id } = req.params;
  await Meme.updateOne(
    { _id: id },
    {
      $set: {
        url: url,
        caption: caption,
        date: req.date,
        time: req.time,
      },
    }
  );
  res.redirect(303, "/");
});

router.patch("/:id/like/:state", async (req, res) => {
  const { id, state } = req.params;
  if (state === "loved")
    await Meme.updateOne({ _id: id }, { $inc: { like: 1 } });
  else await Meme.updateOne({ _id: id }, { $inc: { like: -1 } });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  await Meme.deleteOne({ _id: id });
  res.redirect(303, "/");
});
module.exports = router;
