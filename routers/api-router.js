const apiRouter = require('express').Router();
const fs = require('fs');

apiRouter.get('/', (req, res) => {
  fs.readFile('endpoints.json', 'utf8', (err, data) => {
    res.status(200).send(data);
  });
});

module.exports = apiRouter;
