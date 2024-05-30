require("dotenv").config();

const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const asyncHandler = require("express-async-handler");

const mongoDb = process.env.DBURL;
mongoose.connect(mongoDb);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const User = mongoose.model(
  "User",
  new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }
  })
);

const app = express();
app.set("views", "./views");
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/sign-up", (req, res)=> res.render("signupForm"));

app.post("/sign-up", asyncHandler(async function(req, res, next){
  const user = new User({
  username: req.body.username,
  password: req.body.password
  });
  const result = await user.save();
  res.redirect("/");
}));

app.get("/", (req, res) => res.render("index"));

app.listen(3000, () => console.log("app listening on port 3000!"));
