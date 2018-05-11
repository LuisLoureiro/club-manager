const express = require('express');

const Season = require('./model');
const defaultHandler = require('../defaultEntityRequestHandler');

const router = express.Router();

router.use(express.json());

router.get('/', (req, res, next) => {
  Season.find({}, (err, seasons) => {
    if (err) {
      next(err);
    }

    res.send(seasons);
  });
});

router.get('/:id', (req, res, next) => {
  Season.findById(req.params.id,
    defaultHandler(res, next, season => res.send(season))
  );
});

router.post('/', (req, res, next) => {
  const name = req.body.name;

  Season.create({ name }, (err, season) => {
    if (err) {
      next(err);
    } else {
      res.location(`${req.originalUrl}/${season.id}`).status(201).end();
    }
  });
});

router.put('/:id', (req, res, next) => {
  if (!req.body.season) {
    res.status(400).end();
  } else {
    Season.findByIdAndUpdate(req.params.id, req.body.season,
      defaultHandler(res, next, season => res.sendStatus(204))
    );
  }
});

router.delete('/:id', (req, res, next) => {
  Season.findByIdAndRemove(req.params.id,
    defaultHandler(res, next, season => res.sendStatus(200))
  );
});

module.exports = router;
