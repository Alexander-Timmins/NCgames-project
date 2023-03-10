const {
  returnCategories,
  returnReviews,
  returnReviewComments,
  returnSpecificReview,
  returnUpdatedReview,
  insertReviewComment,
  returnUsers,
  removeComment,
  returnUser,
  returnUpdatedComment,
} = require('./model');

exports.getCategories = (req, res, next) => {
  returnCategories()
    .then((categories) => {
      res.status(200).send({ categories: categories });
    })
    .catch(next);
};

exports.getSpecificReview = (req, res, next) => {
  const reviewId = [req.params.review_Id];
  returnSpecificReview(reviewId)
    .then((review) => {
      res.status(200).send(review[0]);
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const { category, sort_by, order } = req.query;
  returnReviews(category, sort_by, order)
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

exports.updateReviewVotes = (req, res, next) => {
  const reviewId = req.params.review_Id;
  const vote = req.body.inc_votes;
  returnUpdatedReview(reviewId, vote)
    .then((review) => {
      res.status(202).send({ updatedReview: review });
    })
    .catch(next);
};

exports.updateCommentVotes = (req, res, next) => {
  const commentId = req.params.comment_Id;
  const vote = req.body.inc_votes;
  returnUpdatedComment(commentId, vote)
    .then((comment) => {
      res.status(202).send({ updatedComment: comment });
    })
    .catch(next);
};

exports.postReviewComment = (req, res, next) => {
  const reviewId = req.params.review_Id;
  insertReviewComment(req.body, reviewId)
    .then((comments) => {
      res.status(201).send({ comment: comments });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  returnUsers()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next);
};

exports.getUser = (req, res, next) => {
  const username = req.params.username;
  returnUser(username)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const commentId = req.params.comment_Id;
  removeComment(commentId)
    .then((comment) => {
      res.status(204).send();
    })
    .catch(next);
};
