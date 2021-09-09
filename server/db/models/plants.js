/* eslint-disable camelcase */
require('../index');
const mongoose = require('mongoose');

// The schema for the Plant model.
const plantSchema = new mongoose.Schema({
  id_chunk: Number,
  name: String,
  positions: Array,
  size: Array,
});

// creating a new mongoose model instance for Plant.
const Plant = mongoose.model('Plant', plantSchema);

// adds a Plant to the database.
const addPlant = ({
  id_chunk = 0,
  size,
  positions,
}) => {
  const plant = new Plant({
    id_chunk,
    size,
    positions,
  });
  return Plant.find({ id_chunk }).then((plants) => {
    if (plants.length < 50) {
      return plant.save();
    }
    return null;
  })
    .catch((err) => console.error(err));
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
