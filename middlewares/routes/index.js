const express = require('express');

const competitions = require('../../api/competitions/routes');
const clubs = require('../../api/clubs/routes');
const seasons = require('../../api/seasons/routes');
const teams = require('../../api/teams/routes');

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
