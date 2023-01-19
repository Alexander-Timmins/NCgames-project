const express = require('express');
const app = express();
app.use(express.json());

const {
  getCategories,
  standardResponse,
  getSpecificReview,
  getReviews,
  getReviewComments,
  updateReviewVotes,
  postReviewComment,
  getUsers,
  deleteComment
} = require('./controller');

app.get('/api', standardResponse);
app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);
app.get('/api/:review_Id/comments', getReviewComments);
app.get('/api/review/:review_Id', getSpecificReview);
app.patch('/api/review/:review_Id', updateReviewVotes);
app.post('/api/review/:review_Id/comments', postReviewComment);
app.get('/api/users', getUsers);
app.delete('/api/comments/:comment_id', deleteComment);

app.use((err, request, response, next) => {
  if (err.code === '22P02' || err.code === '23502') {
    response.status(400).send({ message: 'Invalid request made' });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ message: err.msg });
  }
});

app.use((err, request, response, next) => {
  response
    .status(500)
    .send({ message: 'Internal server error (coders did a boo boo)' });
});

module.exports = app;
