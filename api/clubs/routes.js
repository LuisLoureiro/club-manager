const express = require('express');

const Club = require('./model');
const defaultHandler = require('../../middlewares/routes/defaultEntityRequestHandler');

const router = express.Router();

router.use(express.json());

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
  const fullName = req.body.fullName;
  const acronym = req.body.acronym;

  Club.create({ fullName, acronym }, defaultHandler(res, next,
    club => res.location(`${req.originalUrl}/${club.id}`).status(201).end())
);
});

router.put('/:id', (req, res, next) => {
  if (!req.body.club) {
    res.status(400).end();
  } else {
    Club.findByIdAndUpdate(req.params.id, req.body.club,
      defaultHandler(res, next, club => res.sendStatus(204))
    );
  }
});

router.delete('/:id', (req, res, next) => {
  Club.findByIdAndRemove(req.params.id,
    defaultHandler(res, next, club => res.sendStatus(200))
  );
});

module.exports = router;
