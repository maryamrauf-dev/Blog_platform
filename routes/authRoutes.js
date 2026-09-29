const express = require("express");
const router = express.Router();

const User = require("../models/users");
const Post = require("../models/posts");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
require("dotenv").config();
const optionalAuth = require("../middleware/optionalAuth");

const JWT_SECRET = process.env.JWT_SECRET;

//public all articles, everyone can read without logging in
router.get("/", optionalAuth, async (req, res) => {
  try {
    const articles = await Post.find()
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.render("home", {
      articles,
      user: req.user || null
    });

  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong.");
  }
});

function redirectIfLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    return next();
  }
  try {
    jwt.verify(token, JWT_SECRET);
    return res.redirect("/");
  } catch (error) {
    res.clearCookie("token");
    next();
  }
}

// GET REGISTER PAGE
router.get("/register", redirectIfLoggedIn, (req, res) => {
  res.render("auth/register", {
    error: null
  });
});

// POST REGISTER
router.post("/register", async (req, res) => {
  try {
    const { fullname, email, password } = req.body;
    // Basic validation
    if (!fullname || !email || !password ) {
      return res.render("auth/register", {  error: "Please fill in all fields."});
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render("auth/register", {  error: "An account with this email already exists."});
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = new User({
      name: fullname,
      email: email,
      passwordHash: hashedPassword
    });
    await user.save();
    // Registration successful
    res.redirect("/login");

  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).render("auth/register", {error: "Something went wrong. Please try again."});
  }
});

// GET LOGIN PAGE
router.get("/login", redirectIfLoggedIn, (req, res) => {
  res.render("auth/login", {
    error: null
  });
});

// POST LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Basic validation
    if (!email || !password) {
      return res.render("auth/login", { error: "Please enter your email and password."});
    }
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.render("auth/login", {error: "Incorrect email or password."});
    }
    // Compare password
    const isMatch = await bcrypt.compare(password,user.passwordHash);
    if (!isMatch) {
      return res.render("auth/login", {error: "Incorrect email or password."});
    }
    // Create JWT
    const token = jwt.sign({ userId: user._id},JWT_SECRET,{expiresIn: "1h"});
    // Store JWT in cookie
    res.cookie("token", token, {httpOnly: true});
    // Login successful
    res.redirect("/");

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).render("auth/login", { error: "Something went wrong. Please try again."});
  }
});

router.get('/auth/google',
  passport.authenticate('google', { scope: ["profile", "email"] }));

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
    });

    res.redirect("/");
  }
);

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;