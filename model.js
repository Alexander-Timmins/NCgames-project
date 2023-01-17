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
  return db
    .query(
      `SELECT reviews.*, COUNT(comment_id)::INT AS comment_count
    FROM reviews
    LEFT JOIN comments ON comments.review_id = reviews.review_id
    GROUP BY reviews.review_id;`
    )
    .then((reviews) => {
      console.log(reviews);
      return reviews.rows;
    });
};

exports.returnReviewComments = (reviewId) => {
  const review = [+reviewId];
  if (typeof review[0] === 'number') {
    return db
      .query(
        `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at ASC;`,
        review
      )
      .then((comment) => {
        if (comment.rows[0] === undefined) {
          let err = 'Not found';
          return Promise.reject({ status: 404, msg: err });
        }
        return comment.rows;
      });
  } else {
    return Promise.reject(err);
  }
};

exports.returnUpdatedReview = (reviewId, vote) => {
  return db
    .query(
      `UPDATE reviews SET votes = votes + $1 WHERE review_id = $2 RETURNING *;`,
      [vote, +reviewId]
    )
    .then((response) => {
      console.log(response.rows);
      if (response.rows[0] === undefined) {
        let err = 'Not found';
        return Promise.reject({ status: 404, msg: err });
      }
      return response.rows;
    });
      }
      
exports.insertReviewComment = (params, reviewId) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [reviewId])
    .then((response) => {
      if (response.rows[0] === undefined) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      } else {
        return db
          .query(
            `INSERT INTO comments (body, author, review_id) VALUES ($1, $2, $3) RETURNING *;`,
            [params.body, params.username, reviewId]
          )
          .then((comment) => {
            return comment.rows[0];
      
    });
};
