/* eslint-disable no-underscore-dangle */
require('../index');
const mongoose = require('mongoose');

// The schema for the creature model.
const creatureSchema = new mongoose.Schema({
  name: String,
  id: Number,
  x: Number,
  y: Number,
  speed: Number,
  size: Number,
  genus: String,
  birthdate: Date,
  id_chunk: String,
  body: Object,
});

// creating a new mongoose model instance for creature.
const Creature = mongoose.model('Creature', creatureSchema);

// kills a creature in the database.
const killCreature = (name) => Creature.findOneAndDelete({ name })
  .then((data) => data).catch((err) => console.error(err));

// updates a creature instance with new creature data.
const updateCreature = (name, newCreature) => Creature.findOneAndUpdate({ name },
  { ...newCreature })
  .exec().catch((err) => console.error(err));

// adds a creature to the database.
const addCreature = ({
  name,
  x,
  y,
  speed,
  size,
  genus,
  body,
}) => {
  const birthdate = new Date();
  const creature = new Creature({
    name,
    x,
    y,
    speed,
    size,
    genus,
    birthdate,
    body,
  });
  return Creature.find({ name: creature.name })
    .then((creat) => {
      if (!creat.length) {
        return creature.save();
      }
      return updateCreature(creat.name, {
        name,
        x,
        y,
        speed,
        size,
        body,
      }).catch((err) => console.error(err));
    }).catch((err) => console.error(err));
};

// get creatures from the database.
const getCreatures = () => Creature.find()
  .then((data) => data)
  .catch((err) => console.error(err));

module.exports = {
  addCreature,
  killCreature,
  updateCreature,
  getCreatures,
};
