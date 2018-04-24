const express = require('express');

const clubs = require('./clubs');

const router = express.Router();

module.exports = logger => {
  router.use(express.json());

  router.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
  });

  router.use('/clubs', clubs);

  return router;
}
