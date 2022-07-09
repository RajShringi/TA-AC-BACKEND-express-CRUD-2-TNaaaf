const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  summary: String,
  author: String,
  pages: Number,
  publication: String,
  cover_image: String,
  category: [String],
});

module.exports = mongoose.model("Book", bookSchema);
