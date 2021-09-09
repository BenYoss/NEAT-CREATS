/* eslint-disable no-underscore-dangle */
require('dotenv').config();
require('./db/index');

const express = require('express');
const path = require('path');
const socketio = require('socket.io');

// server PORT - will add a environmental variable later.
const PORT = process.env.PORT || 8080;
const app = express();
const server = require('http').createServer(app);
const {
  User, Creature, Plant,
} = require('./db/models/models');
const { dbRouter } = require('./routes/db.router');

let firstUserId;

const io = socketio(server);
// app configurations
app.use(express.json());
app.use(dbRouter);
app.use(express.static(path.resolve('./client', 'dist')));
app.get('/', (req, res) => {
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
    firstUserId = await User.getUser().catch((err) => console.error(err));
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
      await User.updateUser(myId, true);
      findFirstUser();
      firstUserId = myId;
    } else {
      firstUserId = firstId;
    }
  };
  // adds a new user to the database.
  await User.addUser(socket.id).catch((err) => console.error(err));
  // function call
  findFirstUser();
  // TODO: dynamically update creature data from all clients.
  socket.on('showCreatures', (creatures) => {
    socket.to('creats').emit('updateCreatures', { creatures, id: socket.id });
  });
  socket.on('showPlants', (plants) => {
    socket.to('creats').emit('updatePlants', { plants, id: socket.id });
  });
  socket.on('isFirstUser', () => {
    if (socket.id === firstUserId) {
      socket.emit('firstResponse', true);
    } else {
      socket.emit('firstResponse', false);
    }
  });

  // TODO: when a creature dies, the record associated with said creature will be deleted.

  socket.on('killCreature', (creature) => {
    Creature.killCreature(creature);
  });
  // TODO: when a user enters the chunk, all creatures/plants in the chunk will render.

  socket.on('updateInfo', async (data) => {
    await Creature.updateCreature(data.creatures).catch((err) => console.error(err));
  });
  // TODO: when a creature reaches the edge of the chunk, it will move to a new chunk.

  // TODO: when a user enters a chunk, the chunk will render.

  socket.on('chunkEnter', async () => {
    const creatures = await Creature.getCreatures();
    const plants = await Plant.getPlants();
    socket.emit('chunkEnterResponse', { creatures, plants });
  });

  // TODO: join functionality should include viewing creature information.
  socket.on('join', () => {
    socket.join('creats');
  });
  socket.on('saveCreatures', async () => {
    findFirstUser();
  });
  // TODO: creatures should be persisted to database using mongoDB methods.
  socket.on('addCreatures', async (creatures) => {
    const addCreatures = creatures.map((creat) => new Promise((res) => {
      const body = creat;
      creat.body = { ...body };
      res(Creature.addCreature(creat));
    }));
    await Promise.all(addCreatures);
  });
  // TODO: food should be persisted with mongoDB methods utilized.
  socket.on('addFood', async (foods) => {
    const addPlants = foods.map((food) => new Promise((res) => {
      res(Plant.addPlant(food));
    }));
    await Promise.all(addPlants);
  });
  // TODO: should update the state of the creatures in the client.

  // When the user disconnects, the user's record will be wiped.
  socket.on('disconnect', async () => {
    await User.killUser(firstUserId);
    if (!Object.keys(io.engine.clients).length) {
      await User.clearUsers();
    }
  });
});
// server listener to start server.
server.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
