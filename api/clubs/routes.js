const express = require('express');

const Club = require('./model');

const router = express.Router();

router.get('/', (req, res) => {
  Club.find({}, (err, clubs) => {
    if (err) {
      throw err;
    }

    res.send(clubs);
  });
});

router.get('/:id', (req, res) => res.sendStatus(501));

router.post('/', (req, res) => res.sendStatus(501));

router.put('/:id', (req, res) => res.sendStatus(501));

router.delete('/:id', (req, res) => res.sendStatus(501))

module.exports = router;
