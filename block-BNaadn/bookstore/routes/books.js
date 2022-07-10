const express = require("express");
const Author = require("../models/Author");
const router = express.Router();
const Book = require("../models/Book");

router.get("/", (req, res, next) => {
  Book.find({}, (err, books) => {
    if (err) return next(err);
    res.render("bookList", { books });
  });
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  Book.findById(id)
    .populate("author_id")
    .exec((err, book) => {
      if (err) return next(err);
      res.render("bookDetail", { book });
    });
});

router.get("/:category/category", (req, res, next) => {
  const category = req.params.category;
  Book.find({ category: category }, (err, books) => {
    if (err) return next(err);
    console.log(books);
    res.render("bookList", { books });
  });
});

router.get("/new", (req, res, next) => {
  res.render("bookForm");
});

router.post("/", (req, res, next) => {
  req.body.category = req.body.category.split(",");
  Book.create(req.body, (err, createdBook) => {
    if (err) return next(err);
    res.redirect("/books");
  });
});

router.get("/:id/edit", (req, res, next) => {
  const id = req.params.id;
  Book.findById(id, (err, book) => {
    res.render("updateForm", { book });
  });
});

router.post("/:id", (req, res, next) => {
  const id = req.params.id;
  req.body.category = req.body.category.split(",");
  Book.findByIdAndUpdate(id, req.body, (err, updatedBook) => {
    res.redirect("/books/" + id);
  });
});

router.get("/:id/delete", (req, res, next) => {
  const id = req.params.id;
  Book.findByIdAndDelete(id, (err, deletedBook) => {
    Author.findByIdAndUpdate(
      deletedBook.author_id,
      { $pull: { books: deletedBook.id } },
      (err, updatedAuthor) => {
        res.redirect("/books/");
      }
    );
  });
});

module.exports = router;
