# Feedback server

This is a tiny Express server used by the frontend to submit feedback.

How to run

1. cd server
2. npm install
3. npm start

The server exposes:
- POST /api/feedback  — accepts JSON body with fields (name, class, section, email, subject, q1, q2)
- GET /api/feedback   — returns all saved submissions

Submissions are stored in `data.json` in the same folder.
