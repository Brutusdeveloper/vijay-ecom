const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSch = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: Number },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "superAdmin", "user", "employee"] },
    createdOn: { type: Number, default: () => Date.now() + 1000 },
  },
  {
    collection: "users"
  },
  { strict: false }
);

module.exports = mongoose.model("user", userSch);
