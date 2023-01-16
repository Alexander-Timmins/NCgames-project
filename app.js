const express = require('express');
const app = express();
app.use(express.json());
const { getCategories, standardResponse, getReviews } = require('./controller');

app.get('/api', standardResponse);
app.get('/api/categories', getCategories);
app.get('/api/reviews', getReviews);

app.use((err, request, response, next) => {
  if (err.status) {
    response.status(err.status).send({ message: err.message });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  if (err.code === '22P02') {
    response.status(400).send({ message: 'Bad request' });
  } else {
    next(err);
  }
});

app.use((err, request, response, next) => {
  response
    .status(500)
    .send({ message: 'Internal server error (coders did a boo boo)' });
});

module.exports = app;
