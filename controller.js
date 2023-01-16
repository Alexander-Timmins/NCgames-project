
const { returnCategories, returnSpecificReview } = require('./model');

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


exports.getSpecificReview = (req, res, next) => {
  let reviewId = [req.params.review_Id];
  returnSpecificReview(reviewId)
    .then((review) => {
      res.status(200).send(review[0]);

exports.getReviews = (req, res, next) => {
  returnReviews()
    .then((reviews) => {
      res.status(200).send({ reviews: reviews });

    })
    .catch(next);
};
