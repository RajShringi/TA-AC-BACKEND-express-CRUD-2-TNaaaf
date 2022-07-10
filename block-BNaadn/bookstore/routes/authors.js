const express = require("express");
const router = express.Router();
const Author = require("../models/Author");
const Book = require("../models/Book");

router.get("/new", (req, res) => {
  res.render("authorAddForm");
});

router.post("/", (req, res, next) => {
  Author.create(req.body, (err, createdAuthor) => {
    if (err) return next(err);
    res.redirect("/authors");
  });
});

router.get("/", (req, res, next) => {
  Author.find({}, (err, authors) => {
    if (err) return next(err);
    res.render("authorList", { authors });
  });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  //   Author.findById(id, (err, author) => {
  //     if (err) return next(err);
  //     res.render("authorDetail", { author });
  //   });
  Author.findById(id)
    .populate("books")
    .exec((err, author) => {
      if (err) return next(err);
      res.render("authorDetail", { author });
    });
});

router.post("/:author_id/books", (req, res, next) => {
  const author_id = req.params.author_id;
  req.body.category = req.body.category.split(",");
  req.body.author_id = author_id;
  Book.create(req.body, (err, createdBook) => {
    if (err) return next(err);
    Author.findByIdAndUpdate(
      author_id,
      { $push: { books: createdBook.id } },
      (err, updatedAuthor) => {
        res.redirect("/authors/" + author_id);
      }
    );
  });
});

module.exports = router;
