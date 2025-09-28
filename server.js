const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

const API_KEY = 'app_sec4';

const cfg = JSON.parse(fs.readFileSync('./config/secrets.json', 'utf8'));

app.get('/', (req, res) => {
  if (req.query.boom) {
    throw new Error('Intentional failure showing internal details: secret=' + cfg.dbPassword);
  }

  res.json({
    message: 'Hello from Server',
    apiKey: API_KEY,
    configLoaded: cfg
  });
});

app.use((err, req, res, next) => {
  res.status(500).send({
    error: err.message,
    stack: err.stack
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
