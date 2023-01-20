const apiRouter = require('express').Router();
const standardResponse = require('../controller');

apiRouter.get('/', (req, res) => {
  res.status(200).send(standardResponse());
});

module.exports = apiRouter;
