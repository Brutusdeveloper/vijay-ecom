const router = require("express").Router();
const Subscribe = require("../schemas/subscribersSchema");
var mailer = require("../nodeMailer/mailer");
const { verify_user_token } = require("../middleware/verifyToken");

// verify_user_token
router.get("/", async (req, res) => {
  let filter = {};
  let key = req.query.key;

  if (!key) {
    res.status(400).send("OOPS!! Bad Request. Please provide the key");
  }
  try {
    switch (parseInt(key)) {
      case 0:
        let subscribedUsers = await Subscribe.find({}).sort({ createdOn: -1 });
        let count = await Subscribe.find().sort({ createdOn: -1 }).length;
        res.status(200).json({ subUsers: subscribedUsers, count: count });
        break;
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/", (req, res) => {
  let body = req.body;
  if (!body.email) return res.json("Please enter your email id!!");

  var mailOptions = {
    to: body.email,
    subject: "Welcome to the ECOM Daily News",
    template: "main",
    context: { name: body.userName },
  };

  Subscribe.findOne({ email: body.email })
    .then((data) => {
      if (!data) {
        let userDetails = new Subscribe(req.body);
        userDetails
          .save()
          .then(() => {
            mailer.sendEmail(mailOptions);
            res.status(200).json("Email sent!!");
          })
          .catch((err) => console.log(err));
      } else {
        res.status(201).json("Already registered with this email!!");
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
