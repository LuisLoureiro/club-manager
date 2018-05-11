const express = require('express');

const Team = require('./model');
const defaultHandler = require('../defaultEntityRequestHandler');

const router = express.Router();

router.use(express.json());

router.get('/', (req, res, next) => {
  Team.find({}, (err, teams) => {
    if (err) {
      next(err);
    }

    res.send(teams);
  });
});

router.get('/:id', (req, res, next) => {
  Team.findById(req.params.id,
    defaultHandler(res, next, team => res.send(team))
  );
});

router.post('/', (req, res, next) => {
  const name = req.body.name;

  Team.create({ name }, (err, team) => {
    if (err) {
      next(err);
    } else {
      res.location(`${req.originalUrl}/${team.id}`).status(201).end();
    }
  });
});

router.put('/:id', (req, res, next) => {
  if (!req.body.team) {
    res.status(400).end();
  } else {
    Team.findByIdAndUpdate(req.params.id, req.body.team,
      defaultHandler(res, next, team => res.sendStatus(204))
    );
  }
});

router.delete('/:id', (req, res, next) => {
  Team.findByIdAndRemove(req.params.id,
    defaultHandler(res, next, team => res.sendStatus(200))
  );
});

module.exports = router;
