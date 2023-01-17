"use strict";

var db = require('./db/connection');

exports.returnCategories = function () {
  return db.query("SELECT * FROM categories").then(function (categories) {
    return categories.rows;
  });
};

exports.returnSpecificReview = function (review_Id) {
  var reviewId = [+review_Id];

  if (typeof reviewId[0] === 'number') {
    return db.query("SELECT * FROM reviews WHERE review_Id = $1;", reviewId).then(function (review) {
      if (review.rows[0] === undefined) {
        var _err = 'Not found';
        return Promise.reject({
          status: 404,
          msg: _err
        });
      }

      return review.rows;
    });
  } else {
    return Promise.reject({
      status: 400,
      msg: err
    });
  }
};

exports.returnReviews = function () {
  return db.query("SELECT reviews.*, COUNT(comment_id) AS comment_count\n    FROM reviews\n    LEFT JOIN comments ON comments.review_id = reviews.review_id\n    GROUP BY review_id;").then(function (reviews) {
    console.log(reviews);
    return reviews.rows;
  });
};

exports.returnReviewComments = function (reviewId) {
  var review = [+reviewId];
  var err = '';

  if (typeof review[0] === 'number') {
    return db.query("SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at ASC;", review).then(function (comment) {
      if (comment.rows[0] === undefined) {
        err = 'Not found';
        return Promise.reject({
          status: 404,
          msg: err
        });
      }

      return comment.rows;
    });
  } else {
    return Promise.reject({
      status: 400,
      msg: err
    });
  }
};

exports.insertReviewComment = function (params, reviewId) {
  return db.query("SELECT * FROM reviews WHERE review_id = $1;", [reviewId]).then(function (response) {
    if (response.rows[0] === undefined) {
      return Promise.reject({
        status: 404,
        msg: 'Not found'
      });
    } else {
      return db.query("INSERT INTO comments (body, author, review_id) VALUES ($1, $2, $3) RETURNING *;", [params.body, params.username, reviewId]).then(function (comment) {
        return comment.rows[0];
      });
    }
  });
};