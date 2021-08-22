const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobsSch = new Schema(
  {
    jobTitle: { type: String, required: true },
    jobDescription: { type: String, required: true },
    jobContent: { type: String, required: true },
    mentionedSalary: { type: String, required: true },
    jobPlace: { type: String, required: true },
    jobType: { type: String, required: true },
    postedBy: { type: String, required: true },
    redirectUrl: { type: String, required: true },
    status: { type: String, enum: ["Active", "Inactive", "Expired"] },
    createdOn: { type: Number, default: () => Date.now() + 1000 },
    company:{type:String,required:true},
    urlToImage:{type:String,required:true}
  },
  {
    collection: "jobsDetails",
  }
);

module.exports = mongoose.model("jobs", jobsSch);
