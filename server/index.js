require('dotenv').config();
require('./db/index');

const express = require('express');
const path = require('path');
const socketio = require('socket.io');

// server PORT - will add a environmental variable later.
const PORT = 8080;
const app = express();
const server = require('http').createServer(app);

const io = socketio(server);
// app configurations
app.use(express.json());
app.use(express.static(path.resolve('./client', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve('./client', 'dist/index.html'));
});

io.on('connection', (socket) => {
  console.log('A new connection has been made!', socket.id);
  socket.on('join', (data) => {
    console.log(data.creatures[0]);
  });
  socket.on('addCreatures', (creatures) => {
    console.log(creatures);
  });
  socket.on('addFood', (foods) => {
    console.log(foods);
  });
  socket.on('updateState', (creatures) => {
    console.log(creatures);
  });
  socket.on('disconnect', () => {
    console.log('LEFT');
  });
});
// server listener to start server.
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
