const db = require('./db/connection');

exports.returnCategories = () => {
  return db.query(`SELECT * FROM categories`).then((categories) => {
    return categories.rows;
  });
};

exports.returnSpecificReview = (review_Id) => {
  const reviewId = [+review_Id];
  if (typeof reviewId[0] === 'number') {
    return db
      .query(`SELECT * FROM reviews WHERE review_Id = $1;`, reviewId)
      .then((review) => {
        if (review.rows[0] === undefined) {
          let err = 'Not found';
          return Promise.reject({ status: 404, msg: err });
        }
        return review.rows;
      });
  } else {
    return Promise.reject({ status: 400, msg: err });
  }
};
exports.returnReviews = () => {
  return db.query(`SELECT * FROM reviews`).then((reviews) => {
    return reviews.rows;
  });
};

exports.returnReviewComments = (reviewId) => {
  const review = [+reviewId];
  let err = '';
  if (typeof review[0] === 'number') {
    return db
      .query(
        `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at ASC;`,
        review
      )
      .then((comment) => {
        if (comment.rows[0] === undefined) {
          err = 'Not found';
          return Promise.reject({ status: 404, msg: err });
        }
        return comment.rows;
      });
  } else {
    return Promise.reject({ status: 400, msg: err });
  }
};

exports.returnUpdatedReview = (reviewId, vote) => {
  const review = +reviewId[0];
  let err = '';
  if (typeof review === 'number') {
    return db
      .query(
        `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
        [vote, review]
      )
      .then((response) => {
        console.log(response.rows);
        return response.rows;
      });
  } else {
    return Promise.reject({ status: 400, msg: err });
  }
};
