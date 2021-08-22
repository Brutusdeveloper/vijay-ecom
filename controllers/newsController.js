const router = require("express").Router();
const News = require("../schemas/newsSchema");

router.get("/:id", (req, res) => {
  let id = req.params.id;
  News.findById(id).then((singleNews) => {
    res.status(200).json({ status: 200, data: singleNews });
  });
});

router.get("/", async (req, res) => {
  let filter = {};
  let key = req.query.key;
  let pgSize;
  let pgNumber;

  if (req.query.title) return (filter.title = req.query.title);

  if (!key)
    return res.status(400).send("OOPS!! Bad Request. Please provide the key");

  try {
    switch (parseInt(key)) {
      case 0:
        let latestNews = await News.find().sort({ publishedAt: -1 }).limit(25);
        let count = await (
          await News.find().sort({ publishedAt: -1 }).limit(25)
        ).length;
        res.status(200).json({ news: latestNews, count: count });
        break;

      case 1:
        let allNews = await News.find({}).sort({ publishedAt: -1 });
        let total = await (await News.find().sort({ publishedAt: -1 })).length;
        res.status(200).json({ news: allNews, count: total });
        break;

      case 2:
        pgSize = parseInt(req.query.pgSize);
        pgNumber = parseInt(req.query.pgNumber);
        let news_list = await News.find(
          {},
          { title: 1, description: 1, urlToImage: 1 }
        )
          .sort({ publishedAt: -1 })
          .skip(pgSize * (pgNumber-1))
          .limit(pgSize);
        news_list.pgSize;
        news_list.pgNumber;
        res
          .status(200)
          .json({ news: news_list, pgSize: pgSize, pgNumber: pgNumber });
        break;
      case 3:
        let total_count = await News.count();
        res.status(200).json({ count: total_count });
        break;
        case 4:
          let relatednews = await News.find().sort({ publishedAt: -1 }).limit(5);
          res.status(200).json({ news: relatednews });
          break;
    }
  } catch (error) {
    console.log(error);
  }
});

router.get("/search-news/:title", async (req, res) => {
  let query = new RegExp(req.params.title, "i");

  News.find({ title: query })
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
