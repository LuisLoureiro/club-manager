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

router.get('/:id', (req, res, next) => {
  Club.findById(req.params.id, (err, club) => {
    if (err) {
      if (err.name === 'CastError') {
        res.sendStatus(404);
      } else {
        next(err);
      }
    } else if (!club) {
      res.sendStatus(404);
    } else {
      res.send(club);
    }
  });
});

router.post('/', (req, res, next) => {
  const name = req.body.name;

  Club.create({ name }, (err, club) => {
    if (err) {
      next(err);
    } else {
      res.location(`/${club._id}`).status(201);
      next();
    }
  });
});

router.put('/:id', (req, res) => res.sendStatus(501));

router.delete('/:id', (req, res) => res.sendStatus(501))

module.exports = router;
