const router = require("express").Router();
const User = require("../schemas/userSchema");
const bcrypt = require("bcrypt");
const { registerValidation } = require("../middleware/validation");

router.post("/", async (req, res) => {
  let body = req.body;
  const { error } = await registerValidation(body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const emailExist = await User.findOne({ email: body.email });
  if (emailExist) return res.status(400).send("Email Already Exists !!");

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(body.password, salt);

  const user = new User({
    userName: body.userName,
    email: body.email,
    mobile: body.mobile,
    password: hashedPassword,
    role: body.role,
  });

  try {
    const saveUser = await user.save();
    res.status(200).json("Successfully registered !!");
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
