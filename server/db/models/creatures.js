require('../index');
const mongoose = require('mongoose');

// The schema for the creature model.
const creatureSchema = mongoose.Schema({
  name: String,
  id: Number,
  posx: Number,
  posy: Number,
  speed: Number,
  size: Number,
  genus: String,
  birthdate: Date,
});

// creating a new mongoose model instance for creature.
const Creature = new mongoose.Model(creatureSchema);

// adds a creature to the database.
const addCreature = ({
  name,
  posx,
  posy,
  speed,
  size,
  genus,
}) => {
  const birthdate = new Date();
  const creature = new Creature({
    name,
    posx,
    posy,
    speed,
    size,
    genus,
    birthdate,
  });

  return creature.save();
};

// kills a creature in the database.
const killCreature = (id) => Creature.find({ _id: id })
  .deleteOne().exec().catch((err) => console.error(err));

// updates a creature instance with new creature data.
const updateCreature = (id, newCreature) => Creature.findOneAndUpdate({ _id: id },
  { ...newCreature })
  .exec().catch((err) => console.error(err));

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
