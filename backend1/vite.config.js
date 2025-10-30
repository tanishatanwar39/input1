import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Development-only: set a permissive Content-Security-Policy header so the browser
  // allows connect-src to the local backend. This ensures the dev server's HTML
  // responses include the header and avoid CSP blocking in DevTools.
  server: {
    middlewareMode: false,
    // use configureServer to add a header on all responses
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        // If the browser requests /favicon.ico from the dev server, serve a tiny
        // transparent PNG so it doesn't 404. Also set a dev CSP header on HTML responses.
        if (req.url === '/favicon.ico') {
          const base64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=';
          const img = Buffer.from(base64, 'base64');
          res.setHeader('Content-Type', 'image/png');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.end(img);
          return;
        }

        // Only set the CSP header for HTML responses
        const accept = req.headers && req.headers.accept;
        if (accept && accept.includes('text/html')) {
          res.setHeader(
            'Content-Security-Policy',
            "default-src 'self' 'unsafe-inline' data: blob:; connect-src 'self' http://localhost:4000 ws://localhost:4000; script-src 'self' 'unsafe-inline' 'unsafe-eval'"
          );
        }
        next();
      });
    }
  }
})
