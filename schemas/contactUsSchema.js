const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactUsSch = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobile: { type: Number },
    email: { type: String, required: true },
    message: { type: String },
    createdOn: { type: Number, default: () => Date.now() + 1000 },
  },
  {
    collection: "contactUs",
  },
  { strict: false }
);

module.exports = mongoose.model("contact", contactUsSch);
