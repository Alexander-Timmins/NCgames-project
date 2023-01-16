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
