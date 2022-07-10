const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  summary: String,
  pages: Number,
  publication: String,
  cover_image: String,
  category: [String],
  author_id: { type: Schema.Types.ObjectId, ref: "Author" },
});

module.exports = mongoose.model("Book", bookSchema);
