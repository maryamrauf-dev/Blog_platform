const express = require("express");
const router = express.Router();

const Post = require("../models/posts");
const authMiddleware = require("../middleware/authmiddleware");


//public all articles so everyone can read
router.get("/articles", async (req, res) => {

  try {
    const articles = await Post.find()
      .populate("userId", "name")
      .sort({ createdAt: -1 });

    res.render("all_articles", {
      articles
    });

  } catch (error) {

    console.error(error);
    res.status(500).send("Something went wrong.");

  }

});

//login required to create
router.get(
  "/articles/create",
  authMiddleware,
  (req, res) => {
    res.render("create_article");

  }
);

//create article login rquired
router.post(
  "/articles",
  authMiddleware,
  async (req, res) => {

    try {

      const {
        title,
        description,
        content
      } = req.body;

      const article = new Post({
        title,
        description,
        content,
        userId: req.userId
      });

      await article.save();

      res.redirect("/my-articles");

    } catch (error) {

      console.error(error);
      res.status(500).send("Something went wrong.");

    }

  }
);

//login required to see my articles
router.get(
  "/my-articles",
  authMiddleware,
  async (req, res) => {

    try {

      const articles = await Post.find({
        userId: req.userId
      }).sort({ createdAt: -1 });

      res.render("my_articles", {
        articles
      });

    } catch (error) {

      console.error(error);
      res.status(500).send("Something went wrong.");
    }
  }
);

router.get(
  "/articles/:id",
  authMiddleware,
  async (req, res) => {

    try {

      const article = await Post.findById(req.params.id)
        .populate("userId", "name");

      if (!article) {
        return res.status(404).send("Article not found.");
      }

      const isOwner =
        article.userId._id.toString() === req.userId;

      res.render("articles", {
        article,
        isOwner
      });

    } catch (error) {

      console.error(error);
      res.status(500).send("Something went wrong.");
    }
  }
);


router.get(
  "/articles/:id/edit",
  authMiddleware,
  async (req, res) => {

    try {

      const article = await Post.findById(req.params.id);

      if (!article) {
        return res.status(404).send("Article not found.");
      }

      if (article.userId.toString() !== req.userId) {
        return res.status(403).send("You cannot edit this article.");
      }

      res.render("edit_article", {
        article
      });

    } catch (error) {

      console.error(error);
      res.status(500).send("Something went wrong.");

    }

  }
);

router.post(
  "/articles/:id/edit",
  authMiddleware,
  async (req, res) => {

    try {

      const article = await Post.findById(req.params.id);

      if (!article) {
        return res.status(404).send("Article not found.");
      }

      if (article.userId.toString() !== req.userId) {
        return res.status(403).send("You cannot edit this article.");
      }

      article.title = req.body.title;
      article.description = req.body.description;
      article.content = req.body.content;

      await article.save();

      res.redirect(`/articles/${article._id}`);

    } catch (error) {

      console.error(error);
      res.status(500).send("Something went wrong.");

    }

  }
);

router.post(
  "/articles/:id/delete",
  authMiddleware,
  async (req, res) => {

    try {

      const article = await Post.findById(req.params.id);

      if (!article) {
        return res.status(404).send("Article not found.");
      }

      if (article.userId.toString() !== req.userId) {
        return res.status(403).send("You cannot delete this article.");
      }

      await Post.findByIdAndDelete(req.params.id);

      res.redirect("/my-articles");

    } catch (error) {

      console.error(error);
      res.status(500).send("Something went wrong.");

    }

  }
);


module.exports = router;