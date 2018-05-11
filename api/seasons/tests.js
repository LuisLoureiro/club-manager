const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');

const Season = require('./model');
const routes = require('./routes');
const db = require('../../middlewares/database');

const app = express();

app.use('/seasons', routes);

chai.use(chaiHttp);
chai.should();


describe('Test api/seasons', () => {

  before(() => {
    db.connect('test')
      .then(() => console.log('test database is ready!'))
      .catch(logErrorAndExit);
  });

  describe('GET /seasons', () => {

    it('should return 200 and have a json type body with an empty array', done => {

      chai.request(app)
        .get('/seasons')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;

          res.body.should.be.an('array').that.is.empty;

          done();
        });
    });
  });

  describe('GET /seasons/:id', () => {

    let insertedSeasons = [];

    before(done => {
      Season.insertMany([ { name: 'FirstSeason' } ], (err, seasons) => {
        logErrorAndExit(err);

        insertedSeasons = seasons;
        done();
      });
    });

    after(done => {
      Season.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should return 404 when id doesn\'t exist', done => {

      chai.request(app)
        .get('/seasons/1')
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should return a Season object when a valid id is given', done => {

      chai.request(app)
        .get(`/seasons/${insertedSeasons[0].id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;

          res.body.should.be.an('object').that.includes({ name: 'FirstSeason' });

          done();
        });
    });
  });

  describe('POST /seasons', () => {

    after(done => {
      Season.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should return 400 when a required field is not sent', done => {

      const postSeason = {};

      chai.request(app)
        .post('/seasons')
        .send(postSeason)
        .end((err, res) => {

          res.should.have.status(400);

          done();
        });
    });

    it('should create a new season', done => {

      const season = { name: 'PostSeason' };

      chai.request(app)
        .post('/seasons')
        .send(season)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.have.header('Location', /^\/seasons\/.*/);

          done();
        });
    });

    it('should have one season created', done => {

      Season.find({}, (err, res) => {
        res.should.have.lengthOf(1);

        done();
      });
    });
  });

  describe('PUT /seasons/:id', () => {

    let insertedSeasons = [];

    beforeEach(done => {
      Season.insertMany([ { name: 'TestPUTSeason' } ], (err, seasons) => {
        logErrorAndExit(err);

        insertedSeasons = seasons;
        done();
      });
    });

    afterEach(done => {
      Season.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should return 400 when no season object is passed in the body', done => {

      chai.request(app)
        .put(`/seasons/${insertedSeasons[0].id}`)
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });

    it('should return 404 when id doesn\'t exist', done => {

      const changedSeason = { season: {} };

      chai.request(app)
        .put('/seasons/1')
        .send(changedSeason)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should update season when a valid id is given', done => {

      const changedSeason = { season: { name: 'UpdatedSeason' } };

      chai.request(app)
        .put(`/seasons/${insertedSeasons[0].id}`)
        .send(changedSeason)
        .end((err, res) => {

          res.should.have.status(204);

          Season.find({}, (err, seasons) => {

            seasons.should.be.an('array').that.has.lengthOf(1);
            seasons[0].name.should.be.equal('UpdatedSeason');

            done();
          });
        });
    });

    it('should return 204 but shouldn\'t update season when no property is passed', done => {

      const changedSeason = { season: {} };

      chai.request(app)
        .put(`/seasons/${insertedSeasons[0].id}`)
        .send(changedSeason)
        .end((err, res) => {

          res.should.have.status(204);

          Season.find({}, (err, seasons) => {

            seasons.should.be.an('array').that.has.lengthOf(1);
            seasons[0].name.should.be.equal('TestPUTSeason');

            done();
          });
        });
    });
  });

  describe('DELETE /seasons/:id', () => {

    let insertedSeasons = [];

    before(done => {
      Season.insertMany([ { name: 'TestDELETESeason' } ], (err, seasons) => {
        logErrorAndExit(err);

        insertedSeasons = seasons;
        done();
      });
    });

    after(done => {
      Season.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should return 404 when id doesn\'t exist', done => {

      chai.request(app)
        .delete('/seasons/1')
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should remove season and return 200', done => {

      chai.request(app)
        .delete(`/seasons/${insertedSeasons[0].id}`)
        .end((err, res) => {
          res.should.have.status(200);

          Season.find({}, (err, seasons) => {

            seasons.should.be.an('array').that.is.empty;

            done();
          });
        });
    });
  });
});

function logErrorAndExit(err) {
  if (err) {
    console.log(err);
    process.exit();
  }
}
