# backend2

Minimal Express backend to receive and store feedback submissions.

Endpoints:
- GET /api/feedback — returns an array of saved feedback items
- POST /api/feedback — accepts JSON { name, email, message } and saves it


Quick start (file-based fallback):

```bash
cd backend2
npm install
npm start
# server will run on http://localhost:4000 by default
```

MongoDB usage:

Set the `MONGODB_URI` environment variable to your connection string (recommended) before starting the server. If `MONGODB_URI` is not set the server will fall back to a built-in URI (not recommended for production).

Example (Linux/macOS):

```bash
export MONGODB_URI="mongodb+srv://<user>:<pass>@cluster0..."
npm start
```

When connected to MongoDB, feedback is stored in the `feedbacks` collection. If MongoDB is unavailable the server will still run but requests to the API will fail with 500 errors.
