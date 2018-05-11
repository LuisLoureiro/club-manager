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

    it('should return 200 and have a json type body with an empty array', done => {

      chai.request(app)
        .get('/clubs')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;

          res.body.should.be.an('array').that.is.empty;

          done();
        });
    });
  });

  describe('GET /clubs/:id', () => {

    let insertedClubs = [];

    before(done => {
      Club.insertMany([ { fullName: 'First Club', acronym: 'FC' } ], (err, clubs) => {
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

    it('should return 404 when id doesn\'t exist', done => {

      chai.request(app)
        .get('/clubs/1')
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should return a Club object when a valid id is given', done => {

      chai.request(app)
        .get(`/clubs/${insertedClubs[0].id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;

          res.body.should.be.an('object').that.includes({ fullName: 'First Club', acronym: 'FC' });

          done();
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

    it('should return 400 when any required field is not sent', done => {

      const postClub = { acronym: 'PC' };

      chai.request(app)
        .post('/clubs')
        .send(postClub)
        .end((err, res) => {

          res.should.have.status(400);

          done();
        });
    });

    it('should create a new club', done => {

      const club = { fullName: 'Post Club', acronym: 'PC' };

      chai.request(app)
        .post('/clubs')
        .send(club)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.have.header('Location', /^\/clubs\/.*/);

          done();
        });
    });

    it('should have one club created', done => {

      Club.find({}, (err, res) => {
        res.should.have.lengthOf(1);
        res[0].should.includes({ fullName: 'Post Club', acronym: 'PC' });

        done();
      });
    });
  });

  describe('PUT /clubs/:id', () => {

    let insertedClubs = [];

    beforeEach(done => {
      Club.insertMany([ { fullName: 'Test PUT Club', acronym: 'TPC' } ], (err, clubs) => {
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

    it('should return 400 when no club object is passed in the body', done => {

      chai.request(app)
        .put(`/clubs/${insertedClubs[0].id}`)
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });

    it('should return 404 when id doesn\'t exist', done => {

      const changedClub = { club: {} };

      chai.request(app)
        .put('/clubs/1')
        .send(changedClub)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should update club when a valid id is given', done => {

      const changedClub = { club: { shortName: 'Updated Club' } };

      chai.request(app)
        .put(`/clubs/${insertedClubs[0].id}`)
        .send(changedClub)
        .end((err, res) => {

          res.should.have.status(204);

          Club.find({}, (err, clubs) => {

            clubs.should.be.an('array').that.has.lengthOf(1);
            clubs[0].shortName.should.be.equal('Updated Club');

            done();
          });
        });
    });

    it('should return 204 but shouldn\'t update club when no property is passed', done => {

      const changedClub = { club: {} };

      chai.request(app)
        .put(`/clubs/${insertedClubs[0].id}`)
        .send(changedClub)
        .end((err, res) => {

          res.should.have.status(204);

          Club.find({}, (err, clubs) => {

            clubs.should.be.an('array').that.has.lengthOf(1);
            clubs[0].should.includes({ fullName: 'Test PUT Club', acronym: 'TPC' });

            done();
          });
        });
    });
  });

  describe('DELETE /clubs/:id', () => {

    let insertedClubs = [];

    before(done => {
      Club.insertMany([ { fullName: 'Test DELETE Club', acronym: 'TDC' } ], (err, clubs) => {
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

    it('should return 404 when id doesn\'t exist', done => {

      chai.request(app)
        .delete('/clubs/1')
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should remove club and return 200', done => {

      chai.request(app)
        .delete(`/clubs/${insertedClubs[0].id}`)
        .end((err, res) => {
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
