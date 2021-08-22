const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const evenstSch = new Schema(
  {
    eventTitle: { type: String, required: true },
    eventDescription: { type: String, required: true },
    eventContent: { type: String, required: true },
    startEvent: { type: Number, required: true },
    endEvent: { type: Number, required: true },
    mediaUrl: { type: Array, required: true },
    redirectUrl: { type: String, required: true },
    createdOn: { type: Number, default: () => Date.now() + 1000 },
  },
  {
    //  collection: "test_articles",
    collection: "events",
  }
);

module.exports = mongoose.model("events", evenstSch);
