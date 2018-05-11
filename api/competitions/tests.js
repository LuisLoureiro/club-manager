const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');

const Competition = require('./model');
const routes = require('./routes');
const db = require('../../middlewares/database');

const app = express();

app.use('/competitions', routes);

chai.use(chaiHttp);
chai.should();


describe('Test api/competitions', () => {

  before(() => {
    db.connect('test')
      .then(() => console.log('test database is ready!'))
      .catch(logErrorAndExit);
  });

  describe('GET /competitions', () => {

    it('should return 200 and have a json type body with an empty array', done => {

      chai.request(app)
        .get('/competitions')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;

          res.body.should.be.an('array').that.is.empty;

          done();
        });
    });
  });

  describe('GET /competitions/:id', () => {

    let insertedCompetitions = [];

    before(done => {
      Competition.insertMany([ { name: 'FirstCompetition' } ], (err, competitions) => {
        logErrorAndExit(err);

        insertedCompetitions = competitions;
        done();
      });
    });

    after(done => {
      Competition.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should return 404 when id doesn\'t exist', done => {

      chai.request(app)
        .get('/competitions/1')
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should return a Competition object when a valid id is given', done => {

      chai.request(app)
        .get(`/competitions/${insertedCompetitions[0].id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;

          res.body.should.be.an('object').that.includes({ name: 'FirstCompetition' });

          done();
        });
    });
  });

  describe('POST /competitions', () => {

    after(done => {
      Competition.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should return 400 when a required field is not sent', done => {

      const postCompetition = {};

      chai.request(app)
        .post('/competitions')
        .send(postCompetition)
        .end((err, res) => {

          res.should.have.status(400);

          done();
        });
    });

    it('should create a new competition', done => {

      const competition = { name: 'PostCompetition' };

      chai.request(app)
        .post('/competitions')
        .send(competition)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.have.header('Location', /^\/competitions\/.*/);

          done();
        });
    });

    it('should have one competition created', done => {

      Competition.find({}, (err, res) => {
        res.should.have.lengthOf(1);

        done();
      });
    });
  });

  describe('PUT /competitions/:id', () => {

    let insertedCompetitions = [];

    beforeEach(done => {
      Competition.insertMany([ { name: 'TestPUTCompetition' } ], (err, competitions) => {
        logErrorAndExit(err);

        insertedCompetitions = competitions;
        done();
      });
    });

    afterEach(done => {
      Competition.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should return 400 when no competition object is passed in the body', done => {

      chai.request(app)
        .put(`/competitions/${insertedCompetitions[0].id}`)
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });

    it('should return 404 when id doesn\'t exist', done => {

      const changedCompetition = { competition: {} };

      chai.request(app)
        .put('/competitions/1')
        .send(changedCompetition)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should update competition when a valid id is given', done => {

      const changedCompetition = { competition: { name: 'UpdatedCompetition' } };

      chai.request(app)
        .put(`/competitions/${insertedCompetitions[0].id}`)
        .send(changedCompetition)
        .end((err, res) => {

          res.should.have.status(204);

          Competition.find({}, (err, competitions) => {

            competitions.should.be.an('array').that.has.lengthOf(1);
            competitions[0].name.should.be.equal('UpdatedCompetition');

            done();
          });
        });
    });

    it('should return 204 but shouldn\'t update competition when no property is passed', done => {

      const changedCompetition = { competition: {} };

      chai.request(app)
        .put(`/competitions/${insertedCompetitions[0].id}`)
        .send(changedCompetition)
        .end((err, res) => {

          res.should.have.status(204);

          Competition.find({}, (err, competitions) => {

            competitions.should.be.an('array').that.has.lengthOf(1);
            competitions[0].name.should.be.equal('TestPUTCompetition');

            done();
          });
        });
    });
  });

  describe('DELETE /competitions/:id', () => {

    let insertedCompetitions = [];

    before(done => {
      Competition.insertMany([ { name: 'TestDELETECompetition' } ], (err, competitions) => {
        logErrorAndExit(err);

        insertedCompetitions = competitions;
        done();
      });
    });

    after(done => {
      Competition.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should return 404 when id doesn\'t exist', done => {

      chai.request(app)
        .delete('/competitions/1')
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should remove competition and return 200', done => {

      chai.request(app)
        .delete(`/competitions/${insertedCompetitions[0].id}`)
        .end((err, res) => {
          res.should.have.status(200);

          Competition.find({}, (err, competitions) => {

            competitions.should.be.an('array').that.is.empty;

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
