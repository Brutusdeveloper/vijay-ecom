const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const videosSch = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    type: { type: String, required: true },
    createdOn: { type: Number, default: () => Date.now() + 1000 },
  },
  {
    // collection: "test_articles",
    collection: "videos",
  }
);

module.exports = mongoose.model("video", videosSch);
