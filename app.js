const express = require('express');
const app = express();
app.use(express.json());
const apiRouter = require('./routers/api-router');

const {
  getCategories,
  standardResponse,
  getSpecificReview,
  getReviews,
  getReviewComments,
  updateReviewVotes,
  postReviewComment,
  getUsers,
  deleteComment,
  getUser,
} = require('./controller');

app.use('/api', apiRouter);
apiRouter.get('', standardResponse);
apiRouter.get('/categories', getCategories);
apiRouter.get('/review', getReviews);
apiRouter.get('/:review_Id/comments', getReviewComments);
apiRouter.get('/review/:review_Id', getSpecificReview);
apiRouter.patch('/review/:review_Id', updateReviewVotes);
apiRouter.post('/review/:review_Id/comments', postReviewComment);
apiRouter.get('/user', getUsers);
apiRouter.get('/user/:username', getUser);
apiRouter.delete('/comments/:comment_id', deleteComment);

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
