module.exports.notFound = (req,res,next) => {
    res.status(404).send('Not found')
};

module.exports.errors = (err,req,res,next) => {
    console.log(err)
    res.status(500).send('Oops!! Something went wrong')
};

module.exports.logger = (req,res,next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};