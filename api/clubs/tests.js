const chai = require('chai');
const chaiHttp = require('chai-http');
const express = require('express');

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
      .catch(err => {
        console.log(err);
        process.exit();
      });
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
});
