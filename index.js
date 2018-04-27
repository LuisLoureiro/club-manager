const bunyan = require('bunyan');
const express = require('express');
const helmet = require('helmet');

const package = require('./package.json');

const db = require('./middlewares/database');
const errorHandler = require('./middlewares/error');
const routes = require('./middlewares/routes');

const app = express();
const log = bunyan.createLogger({ name: package.name });

app.use(helmet());
app.use('/api/v1', routes(log));
app.use(errorHandler(log));

db.connect().then(() => app.listen(process.argv[2] || 3000,
  () => log.info(`${package.name} listening on port ${process.argv[2] || 3000}`)),
  err => log.error(err)
);
