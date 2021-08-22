const { number } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const articlesSch = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: Array },
    type: { type: String },
    author: { type: String },
    PublishedOn: { type: Number},
    imageUrl: { type: String },
    createdOn: { type: Number, default: () => Date.now() + 1000 },
  },
  {
    // collection: "test_articles",
    collection: "articles"
  }
);

module.exports = mongoose.model("articles", articlesSch);
