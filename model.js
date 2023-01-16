const db = require('./db/connection');

exports.returnCategories = () => {
  return db.query(`SELECT * FROM categories`).then((categories) => {
    return categories.rows;
  });
};

exports.returnReviews = () => {
  return db.query(`SELECT * FROM reviews`).then((reviews) => {
    return reviews.rows;
  });
};
