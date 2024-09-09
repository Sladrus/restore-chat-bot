const ApiError = require("../exceptions/ApiError");

require("dotenv").config();

module.exports = function (req, res, next) {
  try {
    const apiKey = req.headers["x-api-key"];

    if (!apiKey || apiKey !== process.env.API_TOKEN) {
      return next(ApiError.UnauthorizedError());
    }
    next();
  } catch (e) {
    return next(ApiError.UnauthorizedError());
  }
};
