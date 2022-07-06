const express = require("express");
const articles = require("../models/articles");
const router = express.Router();
const Article = require("../models/articles");
const comments = require("../models/comments");
const Comment = require("../models/comments");

// show add article form
router.get("/new", (req, res, next) => {
  res.render("addArticleForm");
});
// handle request to add article
router.post("/", (req, res, next) => {
  req.body.tags = req.body.tags.split(",");
  Article.create(req.body, (err, createdArticle) => {
    if (err) return next(err);
    res.redirect("/articles");
  });
});
// show all articles
router.get("/", (req, res, next) => {
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render("articleList", { articles });
  });
});
// show particular article
// router.get("/:id", (req, res, next) => {
//   const id = req.params.id;
//   Article.findById(id, (err, article) => {
//     if (err) return next(err);
//     res.render("articleDetail", { article });
//   });
// });

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Article.findById(id)
    .populate("comments")
    .exec((err, article) => {
      res.render("articleDetail", { article });
    });
});
// show update article form
router.get("/:id/edit", (req, res, next) => {
  const id = req.params.id;
  Article.findById(id, (err, article) => {
    if (err) return next(err);
    res.render("updateArticleForm", { article });
  });
});
// update article
router.post("/:id", (req, res, next) => {
  const id = req.params.id;
  req.body.tags = req.body.tags.split(",");
  Article.findByIdAndUpdate(id, req.body, (err, updatedArticle) => {
    if (err) return next(err);
    res.redirect("/articles/" + id);
  });
});
// Delete article
router.get("/:id/delete", (req, res, next) => {
  const id = req.params.id;
  Article.findByIdAndDelete(id, (err, deletedArticle) => {
    Comment.deleteMany({ articleId: id }, (err, info) => {
      if (err) return next(err);
      res.redirect("/articles");
    });
  });
});
// Like article
router.get("/:id/likes", (req, res, next) => {
  const id = req.params.id;
  Article.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    (err, updatedArticle) => {
      if (err) return next(err);
      res.redirect("/articles/" + id);
    }
  );
});

// create comment
router.post("/:id/comments", (req, res, next) => {
  const id = req.params.id;
  req.body.articleId = id;
  Comment.create(req.body, (err, createdComment) => {
    Article.findByIdAndUpdate(
      id,
      { $push: { comments: createdComment.id } },
      (err, updatedArticle) => {
        if (err) return next(err);
        res.redirect("/articles/" + id);
      }
    );
  });
});

module.exports = router;
