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
      .query(
        `SELECT reviews.*, COUNT(comment_id)::INT AS comment_count
      FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id WHERE reviews.review_id = $1 GROUP BY reviews.review_id;`,
        reviewId
      )
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
      return reviews.rows;
    });
};

exports.returnReviews = (category, sort_by = 'created_at', order = 'desc') => {
  const sorts = ['created_at', 'votes'];
  const orders = ['asc', 'desc'];
  let errMsg = '';
  if (!sorts.includes(sort_by)) {
    errMsg = 'Invalid sorting query';
  } else if (!orders.includes(order)) {
    errMsg = 'Invalid order';
  } else {
    const queryValues = [];
    let queryString = `SELECT reviews.*, COUNT(comment_id)::INT AS comment_count
    FROM reviews LEFT JOIN comments ON comments.review_id = reviews.review_id
    `;
    if (category) {
      queryValues.push(category);
      queryString += ` WHERE reviews.category = $1`;
    }
    queryString += ` GROUP BY reviews.review_id ORDER BY ${sort_by} ${order};`;
    return db.query(queryString, queryValues).then((response) => {
      if (!response.rows.length) {
        errMsg = 'No matching results found';
        return Promise.reject({ status: 404, msg: errMsg });
      }
      return response.rows;
    });
  }
  return Promise.reject({ status: 400, msg: errMsg });
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
      if (response.rows[0] === undefined) {
        let err = 'Not found';
        return Promise.reject({ status: 404, msg: err });
      }
      return response.rows;
    });
};

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
      }
    });
};

exports.returnUsers = () => {
  return db.query(`SELECT * FROM users;`).then((users) => {
    return users.rows;
  });
};

exports.removeComment = (comment_id) => {
  const commentId = [+comment_id];
  if (typeof commentId[0] === 'number') {
    return db
      .query(
        `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
        commentId
      )
      .then((comment) => {
        if (comment.rows.length === 1) {
          return comment.rows;
        } else {
          return Promise.reject({ status: 404, msg: 'Not found' });
        }
      });
  } else {
    return Promise.reject({ status: 400, msg: err });
  }
};
