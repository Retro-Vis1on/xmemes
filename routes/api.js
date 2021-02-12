let express = require("express");
let router = express.Router();
const Meme = require("../model/meme");
const sanitize = require("mongo-sanitize");

function idcheck(id) {
  return id.match(/^[0-9a-fA-F]{24}$/);
}

router.use((req, res, next) => {
  const today = new Date();
  const vals = Date().split(" ");
  req.date = vals[2] + " " + vals[1] + ", " + vals[3];
  req.time = today.getTime();
  next();
});

router.get("/memes", async (req, res) => {
  let memes = await Meme.find({}, { like: 0, date: 0, time: 0, __v: 0 })
    .sort({ time: -1 })
    .limit(100);
  res.send(memes);
});

router.post("/memes", async (req, res) => {
  let temp = sanitize(req.body);
  temp.date = req.date;
  temp.time = req.time;
  if (
    temp.url == null ||
    temp.name == null ||
    temp.caption == null ||
    temp.url.match(/\.(jpeg|jpg|gif|png)$/) == null
  )
    res.sendStatus(400);
  const newMeme = new Meme(temp);
  await newMeme.save();
  res.send(newMeme._id);
});

router.get("/memes/:id", async (req, res) => {
  const { id } = req.params;
  if (idcheck(id)) {
    const meme = await Meme.find({ _id: id });
    if (meme.length) {
      const data = {};
      data.id = meme.id;
      data.url = meme.url;
      data.caption = meme.caption;
      res.send(data);
    } else res.sendStatus(404);
  } else res.sendStatus(404);
});

router.patch("/memes/:id", async (req, res) => {
  const { url, caption } = sanitize(req.body);
  const { id } = req.params;
  if (!idcheck(id)) res.sendStatus(400);
  if (
    url == null ||
    caption == null ||
    url.match(/\.(jpeg|jpg|gif|png)$/) == null
  )
    res.sendStatus(400);
  let { n } = await Meme.updateOne(
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
  if (n == 0) res.sendStatus(404);
  res.sendStatus(201);
});

router.delete("/memes/:id", async (req, res) => {
  const { id } = req.params;
  if (!idcheck(id)) res.sendStatus(400);
  let cur = await Meme.deleteOne({ _id: id });
  if (n == 0) res.sendStatus(404);
  res.sendStatus(200);
});

module.exports = router;
