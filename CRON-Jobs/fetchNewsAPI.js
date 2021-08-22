const MongoClient = require("mongodb").MongoClient;
const axios = require("axios").default;
const url =
  "mongodb+srv://ecom:webmanufactDavid@cluster0.pcaaz.mongodb.net/main?retryWrites=true&w=majority";

MongoClient.connect(
  url,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  function (err, db) {
    if (err) throw err;
    var dbo = db.db("main");

    var options = {
      method: "GET",
      url: "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/TrendingNewsAPI",
      params: {
        pageNumber: "1",
        pageSize: "40",
        withThumbnails: "false",
        location: "us",
      },
      headers: {
        "x-rapidapi-key": "bbf701076fmsh9ccaa59d1ec8452p1b33a2jsn30b905904e1f",
        "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com",
      },
    };

    axios
      .request(options)
      .then(async function (response) {
        let allNews = response.data.value;
        dbo
          .collection("news")
          .find()
          .toArray(async function (err, res) {
            if (err) throw err;
            let db_news = res;

            function comparer(otherArray) {
              return function (current) {
                return (
                  otherArray.filter(function (other) {
                    return other.title == current.title;
                  }).length == 0
                );
              };
            }

            var onlyInA = allNews.filter(comparer(db_news));

            let new_news = [];
            let new_obj;
            for (let i = 0; i < onlyInA.length; i++) {
              new_obj = {
                source: {
                  id: null,
                  name: onlyInA[i].provider.name,
                },
                author: onlyInA[i].provider.name,
                title: onlyInA[i].title,
                description: onlyInA[i].description,
                url: onlyInA[i].image.webpageUrl,
                urlToImage: onlyInA[i].image.url,
                publishedAt: onlyInA[i].datePublished,
                content: onlyInA[i].body,
              };
              new_news.push(new_obj);
            }
            
            if(new_news.length > 0){
              await dbo.collection("news").insertMany(new_news);
            }

            db.close();
          });
      })
      .catch(function (error) {
        console.error(error);
      });
  }
);
