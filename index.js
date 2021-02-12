if (process.env.NODE_ENV !== "production") require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const methodOvrride = require("method-override");
const path = require("path");
const main = require("./routes/main");
const api = require("./routes/api");
const app = express();
const cors = require("cors");

app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/public/partials")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOvrride("_method"));
app.use(cors());
app.use("/", main);
app.use("/", api);

let port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`I'm up at ${port}`);
});
app.get("/pageNotFound", (req, res) => {
  res.render("notFound.ejs", { title: "Page Not Found" });
});
app.use((req, res, next) => {
  res.status(404).redirect("/pageNotFound");
});

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/memes_reserve";
// const dbUrl = "mongodb://localhost:27017/memes_reserve";

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("we're connected!");
  })
  .catch((err) => {
    console.log("Connection Failed!");
    console.log(err);
  });
