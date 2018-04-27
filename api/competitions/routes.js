const express = require('express');

const Competition = require('./model');

const router = express.Router();

router.get('/', (req, res, next) => {
  Competition.find({}, (err, competitions) => {
    if (err) {
      next(err);
    }

    res.send(competitions);
  });
});

router.get('/:id', (req, res) => res.sendStatus(501));

router.post('/', (req, res) => res.sendStatus(501));

router.put('/:id', (req, res) => res.sendStatus(501));

router.delete('/:id', (req, res) => res.sendStatus(501))

module.exports = router;
