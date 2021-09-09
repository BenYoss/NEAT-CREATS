const { Router } = require('express');
const {
  addCreature, killCreature, getCreatures,
} = require('../db/models/creatures');

const dbRouter = Router();

// getting creature data from mongo database.
dbRouter.get('/data/creature', async (req, res) => {
  const data = await getCreatures().catch((err) => console.error(err));
  res.send(data);
});

// adding a creature instance to the database.
dbRouter.post('/data/creature', async (req, res) => {
  const { data } = req.query;
  await addCreature(...data);
  res.end();
});

// deleting a creature from the database.
dbRouter.put('/data/creature', async (req, res) => {
  const { id } = req.body;
  const result = await killCreature(id).catch((err) => console.error(err));
  res.send(result);
});

// exporting the dbrouter.
module.exports = {
  dbRouter,
};
