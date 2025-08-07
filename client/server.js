require('dotenv').config();
const express = require('express');
const cors = require('cors');

const bodyParser = require('body-parser');

const next = require('next');
const http = require('http');

const { router: apiRoutes } = require('./server/route');

const { Server } = require('socket.io');

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

const setupSocket = require('./server/utils/socket/socket');

const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const socketMap = setupSocket(io);

app.set('io', io);
app.set('socketMap', socketMap);

// API Routes
app.use('/api', apiRoutes);

server.listen(PORT, (err) => {
  if (err) throw err;
  console.log(`> Server ready on ${PORT}`);
});
