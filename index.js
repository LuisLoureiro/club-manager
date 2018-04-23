const bunyan = require('bunyan');
const express = require('express');

const package = require('./package.json');

const errorHandler = require('./middlewares/error');
const routes = require('./middlewares/routes');

const app = express();
const log = bunyan.createLogger({ name: package.name });

app.use('/api/v1', routes(log));
app.use(errorHandler(log));

app.listen(3000, () => log.info(`${package.name} listening on port 3000`));
