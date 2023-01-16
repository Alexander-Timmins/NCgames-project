const db = require('./db/connection');

exports.returnCategories = () => {
  return db.query(`SELECT * FROM categories`).then((categories) => {
    return categories.rows;
  });
};

exports.returnSpecificReview = (review_Id) => {
  const reviewId = [+review_Id];
  return db
    .query(`SELECT * FROM reviews WHERE review_Id = $1;`, reviewId)
    .then((review) => {
      return review.rows;
    });
};
