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
  })

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

    before(done => {
      Club.insertMany([ { name: 'FirstClub' } ], err => {
        logErrorAndExit(err);

        done();
      });
    });

    after(() => {
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
  });
});

function logErrorAndExit(err) {
  if (err) {
    console.log(err);
    process.exit();
  }
}
