const express = require("express");
const router = express.Router();
const config = require("./config/config");
const middles = require("./middleware/errorHandler");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const hbs = require("nodemailer-express-handlebars");
const exphbs = require("express-handlebars");
const multipart = require("connect-multiparty");
const app = express();
const path = require("path");
const CronJob = require("cron").CronJob;
var shell = require("shelljs");

const articles = require("./controllers/articlesController");
const users = require("./controllers/userController");
const jobs = require("./controllers/jobsController");
const events = require("./controllers/eventsController");
const videos = require("./controllers/videosController");
const contactUs = require("./controllers/contactUsController");
const news = require("./controllers/newsController");
const subscribers = require("./controllers/subscribersController");
const login = require("./controllers/loginController");
const Dashboard = require("./controllers/dashboardDetailsController");

dotenv.config();

// Connect to MongoDB Url
mongoose.Promise = global.Promise;
mongoose
  .connect(process.env.DB_CONNECT, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then((data) => console.log("Connected to the DB!!"))
  .catch((err) => console.log("Issue connecting with DB", err));
mongoose.set("useCreateIndex", true);

// Register to statis resourced
app.use(morgan("tiny", {}));
app.use(cors());
app.use(middles.logger);
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
// app.set("views", __dirname + "/templateViews");
app.use(express.static(path.join(__dirname, "public")));

// App routes
app.get("/", (req, res) => {
  res.send("API is up & running");
});

var job = new CronJob(
  "0 */6 * * *",
  function () {
    console.log("You will see this message every second");
    if (shell.exec("node CRON-Jobs/fetchNewsAPI.js").code !== 0) {
      console.log("Something weent wrong in CRON reading the file !!");
    }
  },
  null,
  true,
  "America/Los_Angeles"
);
job.start();
app.use("/articles", articles);
app.use("/users", users);
app.use("/jobs", jobs);
app.use("/events", events);
app.use("/videos", videos);
app.use("/contact_us", contactUs);
app.use("/news_articles", news);
app.use("/subscribe", subscribers);
app.use("/login", login);
app.use("/dashboard-details", Dashboard);

app.use(middles.notFound);
app.use(middles.errors);
app.listen(8080, () => console.log("Server is running on port 8080"));
