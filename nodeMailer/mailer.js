const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const config = require("../config/config");

const transporter = nodemailer.createTransport({
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  auth: {
    user: "isabella.santos@ecomdailynews.com",
    pass: "fsd%4YHh2f",
  },
});

const handlebarOptions = {
  viewEngine: {
    extName: ".handlebars",
    partialsDir: path.resolve(__dirname, "../templateViews"),
    defaultLayout: false,
  },
  viewPath: path.resolve(__dirname, "../templateViews"),
  extName: ".handlebars",
};

transporter.use("compile", hbs(handlebarOptions));

module.exports.sendEmail = (data) => {
  try {
    const mailOptions = {
      from: "isabella.santos@ecomdailynews.com",
      ...data,
    };

    // TODO Implement with promise
    return transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        return true;
      }
    });
  } catch (e) {
    return console.log(e);
  }
};
