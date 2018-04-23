const express = require('express');

const router = express.Router();

module.exports = logger => {
  router.use(express.json());
  router.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  router.get('/', (req, res) => res.json({ 'name': 'Hello World' }));

  return router;
}
