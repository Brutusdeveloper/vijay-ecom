const router = require("express").Router();
const User = require("../schemas/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/", async (req, res) => {
  const body = req.body;
  if (!body.email) return res.json("Please enter your email id !!");

  const user = await User.findOne({ email: body.email });
  if (!user) return res.status(400).send("Email or Password is wrong !!");

  const validPassword = await bcrypt.compare(body.password, user.password);
  if (!validPassword) res.status(400).send("Email or Password is wrong !!");

  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);

  res.header("auth_token", token).send(token);
});

module.exports = router;
