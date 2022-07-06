const mongoose = require("mongoose");
const articles = require("./articles");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    articleId: { type: Schema.Types.ObjectId, ref: "Article" },
    likes: { type: Number, default: 0 },
    author: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
