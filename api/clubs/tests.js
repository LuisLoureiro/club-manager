const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');

const Club = require('./model');
const routes = require('./routes');
const db = require('../../middlewares/database');

const app = express();

app.use('/clubs', routes);

chai.use(chaiHttp);
chai.should();


describe('Test api/clubs', () => {

  before(() => {
    db.connect('test')
      .then(() => console.log('test database is ready!'))
      .catch(logErrorAndExit);
  });

  describe('GET /clubs', () => {

    it('should return 200 and have a json type body with an empty array', () => {

      chai.request(app)
        .get('/clubs')
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;

          res.body.should.be.an('array').that.is.empty;
        });
    });
  });

  describe('GET /clubs/:id', () => {

    let insertedClubs = [];

    before(done => {
      Club.insertMany([ { name: 'FirstClub' } ], (err, clubs) => {
        logErrorAndExit(err);

        insertedClubs = clubs;
        done();
      });
    });

    after(done => {
      Club.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should return 404 when id doesn\'t exist', () => {

      chai.request(app)
        .get('/clubs/1')
        .then(res => {
          res.should.have.status(404);
        });
    });

    it('should return a Club object when a valid id is given', () => {

      chai.request(app)
        .get(`/clubs/${insertedClubs[0].id}`)
        .then(res => {
          res.should.have.status(200);
          res.should.be.json;

          res.body.should.be.an('object').that.includes({ name: 'FirstClub' });
        });
    });
  });

  describe('POST /clubs', () => {

    after(done => {
      Club.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should create a new club', () => {

      const club = { name: 'PostClub' };

      chai.request(app)
        .post('/clubs')
        .send(club)
        .then(res => {
          res.should.have.status(201);
          res.should.have.header('Location', /^\/clubs\/.*/);
        });
    });

    it('should have one club created', done => {

      Club.find({}, (err, res) => {
        res.should.have.lengthOf(1);

        done();
      });
    });
  });

  describe('PUT /clubs/:id', () => {

    let insertedClubs = [];

    beforeEach(done => {
      Club.insertMany([ { name: 'TestPUTClub' } ], (err, clubs) => {
        logErrorAndExit(err);

        insertedClubs = clubs;
        done();
      });
    });

    afterEach(done => {
      Club.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should return 404 when id doesn\'t exist', () => {

      chai.request(app)
        .put('/clubs/1')
        .then(res => {
          res.should.have.status(404);
        });
    });

    it('should update club when a valid id is given', done => {

      const changedClub = { club: { name: 'UpdatedClub' } };

      chai.request(app)
        .put(`/clubs/${insertedClubs[0].id}`)
        .send(changedClub)
        .then(res => {

          res.should.have.status(204);

          Club.find({}, (err, clubs) => {

            clubs.should.be.an('array').that.has.lengthOf(1);
            clubs[0].name.should.be.equal('UpdatedClub');

            done();
          });
        });
    });

    it('should return 204 but shouldn\'t update club when no property is passed', done => {

      const changedClub = { club: {} };

      chai.request(app)
        .put(`/clubs/${insertedClubs[0].id}`)
        .send(changedClub)
        .then(res => {

          res.should.have.status(204);

          Club.find({}, (err, clubs) => {

            clubs.should.be.an('array').that.has.lengthOf(1);
            clubs[0].name.should.be.equal('TestPUTClub');

            done();
          });
        });
    });
  });

  describe('DELETE /clubs/:id', () => {

    let insertedClubs = [];

    before(done => {
      Club.insertMany([ { name: 'TestDELETEClub' } ], (err, clubs) => {
        logErrorAndExit(err);

        insertedClubs = clubs;
        done();
      });
    });

    after(done => {
      Club.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should return 404 when id doesn\'t exist', () => {

      chai.request(app)
        .delete('/clubs/1')
        .then(res => {
          res.should.have.status(404);
        });
    });

    it('should remove club and return 200', done => {

      chai.request(app)
        .delete(`/clubs/${insertedClubs[0].id}`)
        .then(res => {
          res.should.have.status(200);

          Club.find({}, (err, clubs) => {

            clubs.should.be.an('array').that.is.empty;

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
