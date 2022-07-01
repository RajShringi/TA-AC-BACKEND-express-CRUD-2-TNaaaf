const express = require("express");
const router = express.Router();
const Article = require("../models/articles");

router.get("/new", (req, res, next) => {
  res.render("addArticleForm");
});

router.post("/", (req, res, next) => {
  req.body.tags = req.body.tags.split(",");
  Article.create(req.body, (err, createdArticle) => {
    if (err) return next(err);
    res.redirect("/articles");
  });
});

router.get("/", (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render("articleList", { articles });
  });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    res.render("articleDetail", { article });
  });
});

router.get("/:id/edit", (req, res, next) => {
  const id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    res.render("updateArticleForm", { article });
  });
});

router.post("/:id", (req, res, next) => {
  const id = req.params.id;
  req.body.tags = req.body.tags.split(",");
  Article.findByIdAndUpdate(id, req.body, (err, updatedArticle) => {
    if (err) return next(err);
    res.redirect("/articles/" + id);
  });
});

router.get("/:id/delete", (req, res, next) => {
  const id = req.params.id;
  Article.findByIdAndDelete(id, (err, deletedArticle) => {
    if (err) return next(err);
    res.redirect("/articles");
  });
});

router.get("/:id/decrement", (req, res, next) => {
  const id = req.params.id;
  req.body.likes += 1;
  Article.findByIdAndUpdate(
    id,
    { $inc: { likes: -1 } },
    (err, updatedArticle) => {
      if (err) return next(err);
      res.redirect("/articles/" + id);
    }
  );
});

router.get("/:id/increment", (req, res, next) => {
  const id = req.params.id;
  req.body.likes -= 1;
  Article.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    (err, updatedArticle) => {
      if (err) return next(err);
      res.redirect("/articles/" + id);
    }
  );
});

module.exports = router;
