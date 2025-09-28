require('dotenv').config(); // loads .env in development if present
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Load secrets/config from environment variables (never commit .env to git)
const API_KEY = process.env.API_KEY || null;
const DB_USER = process.env.DB_USER || null;
const DB_PASSWORD = process.env.DB_PASSWORD || null;
const THIRD_PARTY_API_KEY = process.env.THIRD_PARTY_API_KEY || null;

const cfg = {
  dbUser: DB_USER,
  // dbPassword intentionally not included when sending responses
  thirdPartyApiKey: THIRD_PARTY_API_KEY ? '[REDACTED]' : null
};

function checkRequired() {
  const missing = [];
  if (!API_KEY) missing.push('API_KEY');
  if (!DB_PASSWORD) missing.push('DB_PASSWORD');
  if (missing.length) {
    console.warn(`Warning: missing environment variables: ${missing.join(', ')}. Using placeholders for demo.`);
  }
}
checkRequired();

app.get('/', (req, res) => {
  if (req.query.boom) {
    const secret = DB_PASSWORD || '[no-db-password]';
    throw new Error('Intentional failure (server-side).'); // don't include secret here
  }

  // Respond with safe, non-sensitive info
  res.json({
    message: 'Hello from Server',
    Database_username: DB_USER 
  });
});

app.use((err, req, res, next) => {
  console.error('Internal error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method
    // Do NOT include cfg or DB_PASSWORD here
  });

  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
