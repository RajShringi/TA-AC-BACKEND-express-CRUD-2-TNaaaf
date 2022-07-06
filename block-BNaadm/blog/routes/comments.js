const express = require("express");
const router = express.Router();
const Comment = require("../models/comments");
const Article = require("../models/articles");

router.get("/:id/edit", (req, res, next) => {
  const id = req.params.id;
  Comment.findById(id, (err, comment) => {
    res.render("commentUpdateForm", { comment });
  });
});

router.post("/:id", (req, res, next) => {
  const id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, updatedComment) => {
    if (err) return next(err);
    res.redirect("/articles/" + updatedComment.articleId);
  });
});

router.get("/:id/delete", (req, res, next) => {
  const id = req.params.id;
  Comment.findByIdAndDelete(id, (err, deletedComment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      deletedComment.articleId,
      { $pull: { comments: id } },
      (err, updatedArticle) => {
        if (err) return next(err);
        res.redirect("/articles/" + updatedArticle.id);
      }
    );
  });
});

router.get("/:id/likes", (req, res, next) => {
  const id = req.params.id;
  Comment.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    (err, updatedComment) => {
      if (err) return next(err);
      res.redirect("/articles/" + updatedComment.articleId);
    }
  );
});

module.exports = router;
