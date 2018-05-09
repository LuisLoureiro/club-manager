# Club Manager
API for managing clubs, teams, competitions and seasons.

---

### RUN
#### start app; listens on port 3001
`npm run start`
#### start app with pretty logs; listens on port 3001
`npm run start-pretty`
#### start app with debug mode on; listens on port 3001
`npm run start-debug`

### WATCH FOR CHANGES
#### watch app for code changes; listens on port 3001
`npm run watch`
#### watch app for code changes with pretty logs; listens on port 3001
`npm run watch-pretty`
#### watch app for code changes with debug mode on; listens on port 3001
`npm run watch-debug`

### TEST
#### execute all tests with code coverage enabled;
`npm run test`

---

## Dependencies
1. [expressJS](https://expressjs.com/) to serve queries;
1. [bunyan](https://github.com/trentm/node-bunyan) for logging;
1. [helmet](https://helmetjs.github.io/) to help secure application;
1. [MongoDB](https://www.mongodb.com/);
1. [mongoose](http://mongoosejs.com/) for the MongoDB object modeling;

1. [Mocha](https://mochajs.org) and [Chai](http://www.chaijs.com), with the [chai-http](http://www.chaijs.com/plugins/chai-http/) plugin, to test the application;
1. [Istanbul](https://istanbul.js.org/) as the code coverage reporter;

* [nodemon](http://nodemon.io/) to watch for code changes in development;
