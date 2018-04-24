const express = require('express');

const competitions = require('./competitions');
const clubs = require('./clubs');
const seasons = require('./seasons');
const teams = require('./teams');

const router = express.Router();

module.exports = logger => {
  router.use(express.json());

  router.use((req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`);
    next();
  });

  router.use('/competitions', competitions);
  router.use('/clubs', clubs);
  router.use('/seasons', seasons);
  router.use('/teams', teams);

  return router;
}
