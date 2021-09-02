/* eslint-disable camelcase */
require('../index');
const mongoose = require('mongoose');

// The schema for the Plant model.
const plantSchema = new mongoose.Schema({
  name: String,
  posx: Number,
  posy: Number,
  size: Number,
});

// creating a new mongoose model instance for Plant.
const Plant = mongoose.model('Plant', plantSchema);

// adds a Plant to the database.
const addPlant = ({
  id_chunk,
  size,
  posx,
  posy,
}) => {
  const plant = new Plant({
    id_chunk,
    size,
    posx,
    posy,
  });

  return plant.save();
};

// kills a Plant in the database.
const killPlant = (id) => Plant.find({ _id: id })
  .deleteOne().exec().catch((err) => console.error(err));

// updates a Plant instance with new Plant data.
const updatePlant = (id, newPlant) => Plant.findOneAndUpdate({ _id: id },
  { ...newPlant })
  .exec().catch((err) => console.error(err));

// get Plants from the database.
const getPlants = () => Plant.find()
  .then((data) => data)
  .catch((err) => console.error(err));

module.exports = {
  addPlant,
  killPlant,
  updatePlant,
  getPlants,
};
