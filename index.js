const express = require('express');
const package = require('./package.json');

const app = express();

app.get('/api/v1', (req, res) => res.json({ 'name': 'Hello World' }));

app.listen(3000, () => console.log(`${package.name} listening on port 3000`));
