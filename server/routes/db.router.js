const { Router } = require('express');
const {
  addCreature, killCreature, updateCreature, getCreatures,
} = require('../db/models/creatures');

const dbRouter = Router();

// getting creature data from mongo database.
dbRouter.get('/data/creature', async (req, res) => {
  const { creatureData: data } = await getCreatures();
  res.send(data);
});

// adding a creature instance to the database.
dbRouter.post('/data/creature', async (req, res) => {
  const { data } = req.query;
  await addCreature(...data);
  res.end();
});

// updating creature data from the database.
dbRouter.put('/data/creature/:id', async (req, res) => {
  const { id, creature } = req.query;
  await updateCreature(id, creature);
  res.end();
});

// deleting a creature from the database.
dbRouter.delete('/data/creature/:id', async (req, res) => {
  const { id } = req.params;
  await killCreature(id);
  res.end();
});

// exporting the dbrouter.
module.exports = {
  dbRouter,
};
