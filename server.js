const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const User = require("./models/users");
require("dotenv").config();
require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const articleRoutes = require("./routes/articleRoutes");
const app = express();

// APP CONFIG
app.set("view engine", "ejs");
app.set("views", "./views");

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(async (req, res, next) => {
  res.locals.currentUser = null;

  const token = req.cookies.token;
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.locals.currentUser = await User.findById(decoded.userId).select("name");
  } catch (error) {
    res.clearCookie("token");
  }

  next();
});
app.use(passport.initialize());

// ROUTES
app.use("/", authRoutes);
app.use("/", articleRoutes);

// MONGODB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});