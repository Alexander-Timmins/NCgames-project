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

exports.returnReviews = function (category) {
  var sort_by = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'created_at';
  var order = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'desc';
  var sorts = ['created_at', 'votes'];
  var orders = ['asc', 'desc'];
  var errMsg = '';

  if (!sorts.includes(sort_by)) {
    errMsg = 'invalid sorting query';
  } else if (!orders.includes(order)) {
    errMsg = 'invalid order';
  } else {
    var queryValues = [];
    var queryString = "SELECT reviews.*, COUNT(comment_id)::INT AS comment_count\n    FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id\n    ";

    if (category) {
      queryValues.push(category);
      queryString += " WHERE reviews.category = $1";
    }

    queryString += " GROUP BY reviews.review_id ORDER BY ".concat(sort_by, " ").concat(order, ";");
    return db.query(queryString, queryValues).then(function (response) {
      if (!response.rows.length) {
        errMsg = 'no matching results found';
        return Promise.reject({
          status: 404,
          msg: errMsg
        });
      }

      return response.rows;
    });
  }

  return Promise.reject({
    status: 400,
    msg: errMsg
  });
};

exports.returnReviewComments = function (reviewId) {
  var review = [+reviewId];

  if (typeof review[0] === 'number') {
    return db.query("SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at ASC;", review).then(function (comment) {
      if (comment.rows[0] === undefined) {
        var _err2 = 'Not found';
        return Promise.reject({
          status: 404,
          msg: _err2
        });
      }

      return comment.rows;
    });
  } else {
    return Promise.reject(err);
  }
};

exports.returnUpdatedReview = function (reviewId, vote) {
  return db.query("UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;", [vote, +reviewId]).then(function (response) {
    if (response.rows[0] === undefined) {
      var _err3 = 'Not found';
      return Promise.reject({
        status: 404,
        msg: _err3
      });
    }

    return response.rows;
  });
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

exports.returnUsers = function () {
  return db.query("SELECT * FROM users;").then(function (users) {
    return users.rows;
  });
};