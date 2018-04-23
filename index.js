const bunyan = require('bunyan');
const express = require('express');
const package = require('./package.json');

const app = express();
const log = bunyan.createLogger({ name: package.name })

app.use((req, res, next) => {
  log.info(`${req.method} - ${req.path}`);
  next();
});

app.get('/api/v1', (req, res) => res.json({ 'name': 'Hello World' }));

app.use(function(err, req, res, next) {
  log.error(err);
  res.status(500).send(err.message);
});

app.listen(3000, () => log.info(`${package.name} listening on port 3000`));
