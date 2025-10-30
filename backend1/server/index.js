const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

const DATA_FILE = path.join(__dirname, 'data.json')

function readData() {
  if (!fs.existsSync(DATA_FILE)) return []
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf8')
    return JSON.parse(raw || '[]')
  } catch (e) {
    return []
  }
}

function writeData(arr) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2))
}

app.post('/api/feedback', (req, res) => {
  const payload = req.body || {}
  if (!payload.name) return res.status(400).json({ error: 'name is required' })

  const data = readData()
  data.push({ ...payload, receivedAt: new Date().toISOString() })
  writeData(data)
  res.json({ ok: true })
})

app.get('/api/feedback', (req, res) => {
  const data = readData()
  res.json(data)
})

app.listen(PORT, () => {
  console.log(`Feedback server listening on http://localhost:${PORT}`)
})

// Handle Chrome DevTools probe to avoid 404 noise in browser console
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  res.status(204).end()
})

// Prevent favicon 404 noise from browser requests
app.get('/favicon.ico', (req, res) => {
  // Serve a tiny transparent PNG favicon so the browser doesn't log a 404.
  // This avoids creating a file on disk and is safe for dev use.
  const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';
  const img = Buffer.from(base64, 'base64');
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.send(img);
});
