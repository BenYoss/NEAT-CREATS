require('dotenv').config();
require('./db/index');

const express = require('express');
const path = require('path');
const socketio = require('socket.io');

// server PORT - will add a environmental variable later.
const PORT = 8080;
const app = express();
const server = require('http').createServer(app);

let firstUserId = '';

const io = socketio(server);
// app configurations
app.use(express.json());
app.use(express.static(path.resolve('./client', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve('./client', 'dist/index.html'));
});

// Socket operations
io.on('connection', (socket) => {
  console.log('A new connection has been made!', socket.id);
  if (!firstUserId.length) {
    firstUserId = socket.id;
  }
  socket.on('showCreatures', (creatures) => {
    socket.to('creats').emit('updateCreatures', { creatures, id: socket.id });
  });
  socket.on('isFirstUser', () => {
    if (socket.id === firstUserId) {
      return true;
    }
    return false;
  });
  // TODO: join functionality should include viewing creature information.
  socket.on('join', () => {
    socket.join('creats');
  });
  // TODO: creatures should be persisted to database using mongoDB methods.
  socket.on('addCreatures', (creatures) => {
    console.log(creatures);
  });
  // TODO: food should be persisted with mongoDB methods utilized.
  socket.on('addFood', (foods) => {
    console.log(foods);
  });
  // TODO: should update the state of the creatures in the client.
  socket.on('updateState', (creatures) => {
    console.log(creatures);
  });

  socket.on('disconnec', () => {
    if (socket.id === firstUserId) {
      firstUserId = '';
    }
    console.log('LEFT');
  });
});
// server listener to start server.
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
