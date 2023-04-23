const joi = require("joi");
const { errorResponse } = require("../../utils/index");

const validation = joi.object({
  username: joi.string().min(3).max(20).trim(true).required(),
  phoneno: joi.string().min(10).max(10).required(),
  emailID: joi.string().email().trim(true).required(),
  password: joi.string().min(5).trim(true).required(),
});

const userValidation = async (req, res, next) => {
  const payload = {
    username: req.body.username,
    phoneno: req.body.phoneno,
    emailID: req.body.emailID,
    password: req.body.password,
  };

  const { error } = validation.validate(payload);
  if (error) {
    console.log(error.message)
    return errorResponse(req, res, 'please enter valid data', 400);
  } else {
    next();
  }
};

module.exports = {userValidation};
