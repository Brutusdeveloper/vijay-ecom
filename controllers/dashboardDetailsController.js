const router = require("express").Router();
var Articles = require("../schemas/articlesSchema");
const Events = require("../schemas/eventsSchema");
const News = require("../schemas/newsSchema");
const Jobs = require("../schemas/jobsSchema");
const Videos = require("../schemas/videosSchema");

router.get("/", async (req, res) => {
  let jobs_list = await Jobs.countDocuments();
  let Articles_list = await Articles.countDocuments();
  let Videos_list = await Videos.countDocuments();

  res.status(200).json({
    jobDetails: jobs_list,
    ArticlesDetails: Articles_list,
    videoDetails: Videos_list,
  });
});

module.exports = router;
