const express = require('express');

const Competition = require('./model');
const defaultHandler = require('../defaultEntityRequestHandler');

const router = express.Router();

router.get('/', (req, res, next) => {
  Competition.find({}, (err, competitions) => {
    if (err) {
      next(err);
    }

    res.send(competitions);
  });
});

router.get('/:id', (req, res, next) => {
  Competition.findById(req.params.id,
    defaultHandler(res, next, competition => res.send(competition))
  );
});

router.post('/', (req, res, next) => {
  const name = req.body.name;

  Competition.create({ name }, (err, competition) => {
    if (err) {
      next(err);
    } else {
      res.location(`/${competition._id}`).status(201);
      next();
    }
  });
});

router.put('/:id', (req, res) => res.sendStatus(501));

router.delete('/:id', (req, res) => res.sendStatus(501))

module.exports = router;
