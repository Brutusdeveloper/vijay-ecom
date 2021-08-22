const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const newsSch = new Schema(
  { title: { type: String } },
  { description: { type: String } },
  { url: { type: String } },
  { urlToImage: { type: String } },
  { publishedAt: { type: String } },
  { author: { type: String } },
  { source: { type: Object } },

  { collection: "news" }
);

module.exports = mongoose.model("news", newsSch);
