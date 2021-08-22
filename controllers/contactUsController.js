const router = require("express").Router();
const ContactUs = require("../schemas/contactUsSchema");
const ObjectId = require("mongodb").ObjectID;

router.post("/", (req, res) => {
  let body = req.body;
  if (!body.email) return res.json("Please enter your email id!!");
  let contactUsData = new ContactUs(body);
  contactUsData
    .save()
    .then((data) => {
      res.status(200).json({ message: "Successfully saved!!" });
    })
    .catch((err) => console.log(err));
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
        let contact = await ContactUs.find({}).sort({ createdOn: -1 });
        let count = await ContactUs.find().sort({ createdOn: -1 }).length;
        res.status(200).json({ data: contact, count: count });
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/:id", (req, res) => {
  let id = req.params.id;
  ContactUs.findById(id).then((contactUs) => {
    res.status(200).json({ status: 200, data: contactUs });
  });
});

module.exports = router;
