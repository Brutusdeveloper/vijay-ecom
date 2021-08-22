const router = require("express").Router();
const Events = require("../schemas/eventsSchema");
const { verify_user_token } = require("../middleware/verifyToken");
const { eventValidation } = require("../middleware/validation");

// verify_user_token,
router.put("/:id",verify_user_token, async (req, res, next) => {
  let id = req.params.id;
  let Obj = req.body;

  Events.findByIdAndUpdate(
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

// verify_user_token,
router.post("/",verify_user_token, async (req, res) => {
  let body = req.body;
  const { error } = await eventValidation(body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const newEvent = new Events(body);

  try {
    await newEvent.save(body);
    res.status(200).json({ msg: "Event saved successfully!!" });
  } catch (err) {
    res.status(400).send("err" + err);
  }
});

router.get("/:id", (req, res) => {
  let id = req.params.id;
  Events.findById(id).then((events_detail) => {
    res.status(200).json({ status: 200, data: events_detail });
  });
});

router.get("/", async (req, res) => {
  let filter = {};
  let key = req.query.key;

  if (!key) {
    res.status(400).send("OOPS!! Bad Request. Please provide the key");
  }

  try {
    switch (parseInt(key)) {
      case 0:
        let event_list = await Events.find(
          {},
          {
            eventTitle: 1,
            eventDescription: 1,
            eventContent: 1,
            startEvent: 1,
            endEvent: 1,
            mediaUrl: 1,
            redirectUrl: 1,
            createdOn: 1,
          }
        ).sort({ startEvent: -1 });
        res.status(200).json({ details: event_list });
        break;
      case 1:
        let all_event_list = await Events.find(
          {},
          {
            eventTitle: 1,
            eventDescription: 1,
            eventContent: 1,
            startEvent: 1,
            endEvent: 1,
            mediaUrl: 1,
            redirectUrl: 1,
            createdOn: 1,
          }
        );
        res.status(200).json({ details: all_event_list });
        break;
      case 2:
        let media = await Events.find({}, { _id: 0, mediaUrl: 1 });
        res.status(200).json({ details: media });
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

router.patch("/update-media-array/:id", async (req, res) => {
  let id = req.params.id;
  let Obj = req.body;
  
  try {
    Events.findByIdAndUpdate(
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
  } catch (e) {
    res.status(404).send("SOmething went worng !!");
  }
});

module.exports = router;
