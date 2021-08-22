const router = require("express").Router();
const Jobs = require("../schemas/jobsSchema");
const { verify_user_token } = require("../middleware/verifyToken");
const { jobsValidation } = require("../middleware/validation");

router.get("/:id", (req, res) => {
  let id = req.params.id;
  Jobs.findById(id).then((job_detail) => {
    res.status(200).json({ status: 200, data: job_detail });
  });
});

router.put("/:id", verify_user_token, async (req, res, next) => {
  let id = req.params.id;
  let Obj = req.body;

  Jobs.findByIdAndUpdate(
    id,
    {
      $set: Obj,
      $inc: {
        __v: 1,
      },
    },
    {
      new: true,
    }
  )
    .then((data) => {
      res.status(200).json({
        message: `Updated details of the selected Event Id ${id}`,
      });
    })
    .catch((err) => next(err));
});

router.post("/", verify_user_token, async (req, res) => {
  let body = req.body;
  const { error } = await jobsValidation(body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  const newJobs = new Jobs(body);
  try {
    await newJobs.save();
    res.status(200).json("Successfully registered !!");
  } catch (err) {
    res.status(400).send("errr" + err);
  }
});

router.get("/", async (req, res) => {
  let filter = {};
  let key = req.query.key;

  if (req.query.jobPlace) {
    filter.jobPlace = req.query.jobPlace;
  }
  if (req.query.jobTitle) {
    filter.jobTitle = req.query.jobTitle;
  }

  if (!key) {
    res.status(400).send("OOPS!! Bad Request. Please provide the key");
  }

  try {
    switch (parseInt(key)) {
      case 0:
        let jobslist = await Jobs.find(filter).sort({ createdOn: -1 });
        res.status(200).json({ jobDetails: jobslist });
        break;
      case 1:
        let total_count = await Jobs.count();
        res.status(200).json({ count: total_count });
        break;
      case 2:
        pgSize = parseInt(req.query.pgSize);
        pgNumber = parseInt(req.query.pgNumber);
        let jobs_list = await Jobs.find(
          {},
        )
          .sort({ createdOn: -1 })
          .skip(pgSize * (pgNumber - 1))
          .limit(pgSize);
          jobs_list.pgSize;
        jobs_list.pgNumber;
        res
          .status(200)
          .json({ jobDetails: jobs_list, pgSize: pgSize, pgNumber: pgNumber });
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/search-for-jobs/:jobTitle", async (req, res) => {
  let query = new RegExp(req.params.jobTitle, "i");

  Jobs.find({ jobTitle: query })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
