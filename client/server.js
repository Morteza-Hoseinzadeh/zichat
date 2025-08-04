require('dotenv').config();
const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');

const next = require('next');
const http = require('http');

const { router: apiRoutes } = require('./server/route');

const PORT = process.env.PORT || 5000;
const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes
app.use('/api', apiRoutes);

// nextApp
//   .prepare()
//   .then(() => {
//     // Optional: define static routes
//     const routes = ['/', '/direct', '/crypto'];
//     routes.forEach((route) => {
//       app.get(route, (req, res) => nextApp.render(req, res, route, req.query));
//     });

//     app.get('/direct/pv/:id', (req, res) =>
//       nextApp.render(req, res, '/direct/pv/[id]', {
//         ...req.query,
//         id: req.params.id,
//       })
//     );

//     // Handle everything else
//     app.all('*', (req, res) => handle(req, res));

//     server.listen(PORT, () => {
//       console.log(`🚀 Server ready on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error('❌ Next.js preparation failed:', err);
//     process.exit(1);
//   });

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`> Server ready on ${PORT}`);
});
