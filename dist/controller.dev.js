"use strict";

var _require = require('./model'),
    returnCategories = _require.returnCategories,
    returnReviews = _require.returnReviews,
    returnReviewComments = _require.returnReviewComments,
    returnSpecificReview = _require.returnSpecificReview,
    returnUpdatedReview = _require.returnUpdatedReview,
    insertReviewComment = _require.insertReviewComment,
    returnUsers = _require.returnUsers;

exports.standardResponse = function (req, res) {
  res.status(200).send('Api ready to serve');
};

exports.getCategories = function (req, res, next) {
  returnCategories().then(function (categories) {
    res.status(200).send({
      categories: categories
    });
  })["catch"](next);
};

exports.getSpecificReview = function (req, res, next) {
  var reviewId = [req.params.review_Id];
  returnSpecificReview(reviewId).then(function (review) {
    res.status(200).send(review[0]);
  })["catch"](next);
};

exports.getReviews = function (req, res, next) {
  var _req$query = req.query,
      category = _req$query.category,
      sort_by = _req$query.sort_by,
      order = _req$query.order;
  returnReviews(category, sort_by, order).then(function (reviews) {
    res.status(200).send({
      reviews: reviews
    });
  })["catch"](next);
};

exports.getReviewComments = function (req, res, next) {
  var reviewId = req.params.review_Id;
  returnReviewComments(reviewId).then(function (comments) {
    res.status(200).send({
      comments: comments
    });
  })["catch"](next);
};

exports.updateReviewVotes = function (req, res, next) {
  var reviewId = req.params.review_Id;
  var vote = req.body.inc_votes;
  returnUpdatedReview(reviewId, vote).then(function (review) {
    res.status(202).send({
      updatedReview: review
    });
  })["catch"](next);
};

exports.postReviewComment = function (req, res, next) {
  var reviewId = req.params.review_Id;
  insertReviewComment(req.body, reviewId).then(function (comments) {
    res.status(201).send({
      comment: comments
    });
  })["catch"](next);
};

exports.getUsers = function (req, res, next) {
  returnUsers().then(function (users) {
    res.status(200).send(users);
  })["catch"](next);
};