const { returnCategories, returnReviews } = require('./model');

exports.standardResponse = (req, res) => {
  res.status(200).send('Api ready to serve');
};

exports.getCategories = (req, res, next) => {
  returnCategories()
    .then((categories) => {
      res.status(200).send({ categories: categories });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  returnReviews()
    .then((reviews) => {
      res.status(200).send({ reviews: reviews });
    })
    .catch(next);
};
