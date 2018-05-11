const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');

const Team = require('./model');
const routes = require('./routes');
const db = require('../../middlewares/database');

const app = express();

app.use('/teams', routes);

chai.use(chaiHttp);
chai.should();


describe('Test api/teams', () => {

  before(() => {
    db.connect('test')
      .then(() => console.log('test database is ready!'))
      .catch(logErrorAndExit);
  });

  describe('GET /teams', () => {

    it('should return 200 and have a json type body with an empty array', done => {

      chai.request(app)
        .get('/teams')
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;

          res.body.should.be.an('array').that.is.empty;

          done();
        });
    });
  });

  describe('GET /teams/:id', () => {

    let insertedTeams = [];

    before(done => {
      Team.insertMany([ { name: 'FirstTeam' } ], (err, teams) => {
        logErrorAndExit(err);

        insertedTeams = teams;
        done();
      });
    });

    after(done => {
      Team.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should return 404 when id doesn\'t exist', done => {

      chai.request(app)
        .get('/teams/1')
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should return a Team object when a valid id is given', done => {

      chai.request(app)
        .get(`/teams/${insertedTeams[0].id}`)
        .end((err, res) => {
          res.should.have.status(200);
          res.should.be.json;

          res.body.should.be.an('object').that.includes({ name: 'FirstTeam' });

          done();
        });
    });
  });

  describe('POST /teams', () => {

    after(done => {
      Team.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should create a new team', done => {

      const team = { name: 'PostTeam' };

      chai.request(app)
        .post('/teams')
        .send(team)
        .end((err, res) => {
          res.should.have.status(201);
          res.should.have.header('Location', /^\/teams\/.*/);

          done();
        });
    });

    it('should have one team created', done => {

      Team.find({}, (err, res) => {
        res.should.have.lengthOf(1);

        done();
      });
    });
  });

  describe('PUT /teams/:id', () => {

    let insertedTeams = [];

    beforeEach(done => {
      Team.insertMany([ { name: 'TestPUTTeam' } ], (err, teams) => {
        logErrorAndExit(err);

        insertedTeams = teams;
        done();
      });
    });

    afterEach(done => {
      Team.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should return 400 when no team object is passed in the body', done => {

      chai.request(app)
        .put(`/teams/${insertedTeams[0].id}`)
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });

    it('should return 404 when id doesn\'t exist', done => {

      const changedTeam = { team: {} };

      chai.request(app)
        .put('/teams/1')
        .send(changedTeam)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should update team when a valid id is given', done => {

      const changedTeam = { team: { name: 'UpdatedTeam' } };

      chai.request(app)
        .put(`/teams/${insertedTeams[0].id}`)
        .send(changedTeam)
        .end((err, res) => {

          res.should.have.status(204);

          Team.find({}, (err, teams) => {

            teams.should.be.an('array').that.has.lengthOf(1);
            teams[0].name.should.be.equal('UpdatedTeam');

            done();
          });
        });
    });

    it('should return 204 but shouldn\'t update team when no property is passed', done => {

      const changedTeam = { team: {} };

      chai.request(app)
        .put(`/teams/${insertedTeams[0].id}`)
        .send(changedTeam)
        .end((err, res) => {

          res.should.have.status(204);

          Team.find({}, (err, teams) => {

            teams.should.be.an('array').that.has.lengthOf(1);
            teams[0].name.should.be.equal('TestPUTTeam');

            done();
          });
        });
    });
  });

  describe('DELETE /teams/:id', () => {

    let insertedTeams = [];

    before(done => {
      Team.insertMany([ { name: 'TestDELETETeam' } ], (err, teams) => {
        logErrorAndExit(err);

        insertedTeams = teams;
        done();
      });
    });

    after(done => {
      Team.deleteMany({}, err => {
        logErrorAndExit(err);

        done();
      });
    });

    it('should return 404 when id doesn\'t exist', done => {

      chai.request(app)
        .delete('/teams/1')
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should remove team and return 200', done => {

      chai.request(app)
        .delete(`/teams/${insertedTeams[0].id}`)
        .end((err, res) => {
          res.should.have.status(200);

          Team.find({}, (err, teams) => {

            teams.should.be.an('array').that.is.empty;

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
