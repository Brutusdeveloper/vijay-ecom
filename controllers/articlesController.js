const router = require("express").Router();
var Articles = require("../schemas/articlesSchema");
const { verify_user_token } = require("../middleware/verifyToken");
const { articleValidation } = require("../middleware/validation");
var multipart = require("connect-multiparty");
var multipartMiddleware = multipart({ uploadDir: "./images" }); //multipart({ __dirname: "../images" });
var multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: "public/articlesImg/",
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
}).single("imageUrl");

router.put("/:id", verify_user_token, async (req, res, next) => {
  let id = req.params.id;
  let Obj = req.body;

  Articles.findByIdAndUpdate(
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
        message: `Updated details of the selected Article Id ${id}`,
      });
    })
    .catch((err) => next(err));
});

router.post("/upload", multipartMiddleware, function (req, res) {
  var TempFile = req.files.upload;
  var TempPathfile = TempFile.path;
  let modifyName = TempFile.name.replace(/\s/g, "");

  const targetPathUrl = path.join(
    __dirname,
    "../public/inner_article_images/" + modifyName
  );

  if (
    path.extname(TempFile.originalFilename).toLowerCase() === ".png" ||
    ".jpg"
  ) {
    fs.rename(TempPathfile, targetPathUrl, (err) => {
      res.status(200).json({
        uploaded: true,
        url: "https://api.ecomdailynews.com/inner_article_images/" + modifyName,
      });

      if (err) return console.log(err);
    });
  }
  console.log(req.files);
});

//verify_user_token,
router.post("/", verify_user_token, async (req, res) => {
  let body = req.body;
  const { error } = await articleValidation(body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const newArticle = new Articles(body);

  try {
    await newArticle.save();
    res.status(200).json("Successfully registered !!");
  } catch (err) {
    res.status(400).send("errr" + err);
  }
});

router.get("/:id", (req, res) => {
  let id = req.params.id;
  Articles.findById(id).then((singleArticle) => {
    res.status(200).json({ status: 200, data: singleArticle });
  });
});

router.get("/", async (req, res) => {
  let filter = {};
  let key = req.query.key;
  let pgSize;
  let pgNumber;

  if (!key) {
    res.status(400).send("OOPS!! Bad Request. Please provide the key");
  }

  try {
    switch (parseInt(key)) {
      case 0:
        let latestArticles = await Articles.find()
          .sort({ createdOn: -1 })
          .limit(24);
        let count = await (
          await Articles.find().sort({ createdOn: -1 }).limit(24)
        ).length;
        res.status(200).json({ articles: latestArticles, count: count });
        break;
      case 1:
        let allArticles = await Articles.find().sort({ createdOn: -1 });
        let total = await (
          await Articles.find().sort({ createdOn: -1 })
        ).length;
        res.status(200).json({ articles: allArticles, count: total });

      case 2:
        let articles = await Articles.find(
          {},
          { title: 1, author: 1, createdOn: 1 }
        ).sort({ createdOn: -1 });
        res.status(200).json({ articles: articles });
        break;

      case 3:
        pgSize = parseInt(req.query.pgSize);
        pgNumber = parseInt(req.query.pgNumber);
        let articles_list = await Articles.find(
          {},
          { title: 1, description: 1,imageUrl:1 }
        )
          .sort({ publishedAt: -1 })
          .skip(pgSize * (pgNumber-1))
          .limit(pgSize);
        articles_list.pgSize;
        articles_list.pgNumber;
        res
          .status(200)
          .json({ articles: articles_list, pgSize: pgSize, pgNumber: pgNumber });
        break;
        case 4:
          let total_Articles = await Articles.count()
          res.status(200).json({ count: total_Articles });
  
    }
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
