const express = require('express');

const Competition = require('./model');
const defaultHandler = require('../../middlewares/routes/defaultEntityRequestHandler');

const router = express.Router();

router.use(express.json());

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

  Competition.create({ name }, defaultHandler(res, next,
    competition => res.location(`${req.originalUrl}/${competition.id}`).status(201).end())
  );
});

router.put('/:id', (req, res, next) => {
  if (!req.body.competition) {
    res.status(400).end();
  } else {
    Competition.findByIdAndUpdate(req.params.id, req.body.competition,
      defaultHandler(res, next, competition => res.sendStatus(204))
    );
  }
});

router.delete('/:id', (req, res, next) => {
  Competition.findByIdAndRemove(req.params.id,
    defaultHandler(res, next, competition => res.sendStatus(200))
  );
});

module.exports = router;
