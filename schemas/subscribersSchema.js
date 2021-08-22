const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subscribeSch = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number },
    status: {
      type: String,
      enum: ["subscribed", "unsubscribed"],
      default: "subscribed",
    },
    createdOn: { type: Number, default: () => Date.now() + 1000 },
  },
  {
    collection: "subscribers",
  }
);

module.exports = mongoose.model("subscribe", subscribeSch);
