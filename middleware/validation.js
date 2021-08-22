const Joi = require("joi");

const articleValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(4).required(),
    description: Joi.string().min(20).required(),
    content: Joi.string().min(100).required(),
    tags: Joi.array(),
    type: Joi.string(),
    author: Joi.string().required(),
    PublishedOn: Joi.number(),
    imageUrl: Joi.string().required(),
  });
  return schema.validate(data);
};

const eventValidation = (data) => {
  const schema = Joi.object({
    eventTitle: Joi.string().min(4).required(),
    eventDescription: Joi.string().min(10).required(),
    eventContent: Joi.string().min(30).required(),
    startEvent: Joi.number().required(),
    endEvent: Joi.number().required(),
    mediaUrl: Joi.array().required(),
    redirectUrl: Joi.string(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(5).required(),
  });
  return schema.validate(data);
};

const registerValidation = (data) => {
  const schema = Joi.object({
    userName: Joi.string().min(3).required(),
    email: Joi.string().min(6).required().email(),
    mobile: Joi.number().min(10),
    password: Joi.string().min(5).required(),
    role: Joi.string().required(),
  });
  return schema.validate(data);
};

const videoValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().min(4).required(),
    description: Joi.string().min(20).required(),
    mediaUrl: Joi.string().required(),
    type: Joi.string(),
  });
  return schema.validate(data);
};

const jobsValidation = (data) => {
  const schema = Joi.object({
    jobTitle: Joi.string().min(3).required(),
    jobDescription: Joi.string().min(10).required(),
    jobContent: Joi.string().min(20).required(),
    mentionedSalary: Joi.string(),
    jobPlace: Joi.string().required(),
    jobType: Joi.string().required(),
    postedBy: Joi.string().required(),
    redirectUrl: Joi.string().required(),
    status: Joi.string().required(),
    urlToImage: Joi.string().required(),
    company: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports.eventValidation = eventValidation;
module.exports.jobsValidation = jobsValidation;
module.exports.articleValidation = articleValidation;
module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;
module.exports.videoValidation = videoValidation;
