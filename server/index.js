/* eslint-disable no-underscore-dangle */
require('dotenv').config();
require('./db/index');

const express = require('express');
const path = require('path');
const socketio = require('socket.io');

// server PORT - will add a environmental variable later.
const PORT = 8080;
const app = express();
const server = require('http').createServer(app);
const {
  addUser, killUser, updateUser, getUser, clearUsers,
} = require('./db/models/user');

let firstUserId;

const io = socketio(server);
// app configurations
app.use(express.json());
app.use(express.static(path.resolve('./client', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve('./client', 'dist/index.html'));
});
// Socket operations
io.on('connection', async (socket) => {
  /**
   * @function findFirstUser:
   * Async function that searchs for the first user from the list of
   * users in the database.
   */
  const findFirstUser = async () => {
    // fetch dataset of users from database
    firstUserId = await getUser().catch((err) => console.error(err));
    let bool = false;
    // id of the user
    let myId;
    // what will be the id of the first user
    let firstId;
    firstUserId.forEach((user) => {
      // if the user's already first.
      if (user.isFirst) {
        bool = true;
        firstId = user.idUser;
      }
      // if the user is the current user on the site.
      if (user.idUser === socket.id) {
        myId = user._id;
      }
    });
    // if there aren't any first users, the next user in the database will be first.
    if (!bool) {
      await updateUser(myId, true);
      findFirstUser();
    } else {
      firstUserId = firstId;
    }
  };

  // adds a new user to the database.
  await addUser(socket.id).catch((err) => console.error(err));
  // function call
  findFirstUser();
  // TODO: dynamically update creature data from all clients.
  socket.on('showCreatures', (creatures) => {
    socket.to('creats').emit('updateCreatures', { creatures, id: socket.id });
  });
  socket.on('isFirstUser', () => {
    if (socket.id === firstUserId) {
      socket.emit('firstResponse', true);
    }
    socket.emit('firstResponse', false);
  });
  // TODO: join functionality should include viewing creature information.
  socket.on('join', () => {
    socket.join('creats');
  });
  socket.on('saveCreatures', async () => {
    findFirstUser();
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

  // When the user disconnects, the user's record will be wiped.
  socket.on('disconnect', async () => {
    await killUser(firstUserId);
    if (!Object.keys(io.engine.clients).length) {
      await clearUsers();
    }
  });
});
// server listener to start server.
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
