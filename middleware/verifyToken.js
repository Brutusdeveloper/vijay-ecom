const jwt = require("jsonwebtoken");

module.exports.verify_user_token = function (req, res, next) {
  const token = req.headers["authtoken"];

  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};
