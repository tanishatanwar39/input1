require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const Feedback = require('./models/Feedback');

const app = express();
app.use(cors());
app.use(express.json());

// Require MONGODB_URI via environment variable to avoid accidentally committing credentials.
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('\nERROR: MONGODB_URI environment variable is not set.');
  console.error('Set MONGODB_URI before starting the server. Example:');
  console.error("export MONGODB_URI=\"mongodb+srv://<user>:<password>@cluster0...\"");
  console.error('If your password contains special characters (like % or @), URL-encode them using encodeURIComponent.');
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI, { autoIndex: true })
  .then(() => console.log('backend2: connected to MongoDB'))
  .catch((err) => {
    console.error('backend2: MongoDB connection error', err && err.message ? err.message : err);
    // Provide actionable guidance for common auth error
    if (err && (err.name === 'MongoServerError' || /Authentication failed/i.test(err.message || ''))) {
      console.error('\nAuthentication failed. Common fixes:');
      console.error('- Confirm the username and password are correct for your Atlas cluster user.');
      console.error("- If the password contains special characters (e.g. '%', '@', '#'), URL-encode it. Example in bash:");
      console.error("  export ENCODED_PASS=$(node -e \"console.log(encodeURIComponent(process.argv[1]))\" 'yourPasswordHere')");
      console.error('  Then build MONGODB_URI using the encoded password.');
      console.error("- Ensure your IP address is allowed in the Atlas Network Access (or allow access from anywhere for testing: 0.0.0.0/0).");
    }
    process.exit(1);
  });

  // Respond to Chrome DevTools / appspecific probe to avoid noisy 404s in the browser console.
  // DevTools may probe `/.well-known/appspecific/com.chrome.devtools.json`. Reply with 204 No Content.
  app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    // minimal response: 204 No Content
    res.status(204).end();
  });

  // Prevent favicon 404 noise from browser requests
  app.get('/favicon.ico', (req, res) => {
    // Serve a tiny transparent PNG favicon so the browser doesn't log a 404.
    const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';
    const img = Buffer.from(base64, 'base64');
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(img);
  });

app.get('/api/feedback', async (req, res) => {
  try {
    const items = await Feedback.find().sort({ createdAt: 1 }).lean();
    res.json(items);
  } catch (err) {
    console.error('GET /api/feedback error', err);
    res.status(500).json({ error: 'failed to fetch feedback' });
  }
});

app.post('/api/feedback', async (req, res) => {
  const payload = req.body || {};
  if (!payload.name) {
    return res.status(400).json({ error: 'name is required' });
  }

  try {
    // Store the full payload (allows class, section, subject, q1, q2, etc.)
    const feedback = await Feedback.create(payload);
    res.status(201).json(feedback);
  } catch (err) {
    console.error('POST /api/feedback error', err);
    res.status(500).json({ error: 'failed to save feedback' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`backend2: server listening on http://localhost:${PORT}`);
});
