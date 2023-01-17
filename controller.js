const {
  returnCategories,
  returnReviews,
  returnReviewComments,
  returnSpecificReview,
  postNewComment,
} = require('./model');

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

exports.getReviewComments = (req, res, next) => {
  const reviewId = req.params.review_Id;
  returnReviewComments(reviewId)
    .then((comments) => {
      res.status(200).send({ comments: comments });
    })
    .catch(next);
};

exports.postReviewComment = (req, res, next) => {
  const reviewId = req.params.review_Id;
  postNewComment(req.body, reviewId)
    .then((comments) => {
      res.status(201).send({ comment: comments[0] });
    })
    .catch(next);
};
