require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const next = require('next');
const http = require('http');

// Import both the router and WebSocket creator from your route file
const { router: apiRoutes } = require('./server/route');

const PORT = process.env.PORT || 5000;
const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.NODE_ENV !== 'production' ? 'localhost' : 'production';
const nextApp = next({ dev, hostname, PORT });

const handle = nextApp.getRequestHandler();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// Next.js Routes
nextApp
  .prepare()
  .then(() => {
    const routes = ['/', '/direct', '/crypto'];

    routes.forEach((route) => {
      app.get(route, (req, res) => nextApp.render(req, res, route, req.query));
    });

    app.get('/direct/pv/:id', (req, res) => {
      return nextApp.render(req, res, `/direct/pv/${req.params.id}`, req.query);
    });

    // Handle all other routes with Next.js
    app.all('*', (req, res) => handle(req, res));

    // Error handling
    server.on('error', (error) => {
      console.error('Server error:', error);
    });

    // Start server
    server.listen(PORT, (err) => {
      if (err) throw err;
      console.log(`> Server ready on ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Next.js preparation failed:', err);
    process.exit(1);
  });
