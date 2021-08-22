const router = require("express").Router();
const Videos = require("../schemas/videosSchema");
const { verify_user_token } = require("../middleware/verifyToken");
const { videoValidation } = require("../middleware/validation");

//verify_user_token,
router.put("/:id",verify_user_token, async (req, res, next) => {
  let id = req.params.id;
  let Obj = req.body;

  Videos.findByIdAndUpdate(
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
        message: `Updated details of the selected video Id ${id}`,
      });
    })
    .catch((err) => next(err));
});

router.post("/", verify_user_token, async (req, res) => {
  let body = req.body;
  const { error } = await videoValidation(body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const newVideo = new Videos(body);

  try {
    await newVideo.save();
    res.status(200).json("Successfully saved !!");
  } catch (err) {
    res.status(400).send("errr" + err);
  }
});

router.get("/:id", (req, res) => {
  let id = req.params.id;
  Videos.findById(id).then((singleVid) => {
    res.status(200).json({ status: 200, data: singleVid });
  });
});

router.get("/", async (req, res) => {
  let filter = {};
  let key = req.query.key;

  if (req.query.type) {
    filter.type = req.query.type;
  }

  if (!key) {
    res.status(400).send("OOPS!! Bad Request. Please provide the key");
  }

  try {
    switch (parseInt(key)) {
      case 0:
        let latestVids = await Videos.find(filter).sort({ createdOn: -1 });
        let count = await (
          await Videos.find().sort({ createdOn: -1 }).limit(4)
        ).length;
        res.status(200).json({ vids: latestVids, count: count });
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
