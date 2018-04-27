const express = require('express');

const Club = require('./model');
const defaultHandler = require('../defaultEntityRequestHandler');

const router = express.Router();

router.get('/', (req, res, next) => {
  Club.find({}, (err, clubs) => {
    if (err) {
      next(err);
    }

    res.send(clubs);
  });
});

router.get('/:id', (req, res, next) => {
  Club.findById(req.params.id,
    defaultHandler(res, next, club => res.send(club))
  );
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

router.put('/:id', (req, res, next) => {
  Club.findByIdAndUpdate(req.params.id, req.body.club,
    defaultHandler(res, next, club => res.sendStatus(204))
  );
});

router.delete('/:id', (req, res, next) => {
  Club.findByIdAndRemove(req.params.id,
    defaultHandler(res, next, club => res.sendStatus(200))
  );
});

module.exports = router;
