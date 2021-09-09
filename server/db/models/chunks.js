/* eslint-disable camelcase */
require('../index');
const mongoose = require('mongoose');

// The schema for the chunk model.
const chunkSchema = new mongoose.Schema({
  name: String,
  owner: String,
  count_chunk: Number,
  count_plant: Number,
  last_explored: Date,
});

const Chunk = mongoose.model('Chunk', chunkSchema);

// adds a Chunk to the database.
const addChunk = ({
  name,
  owner,
  count_chunk,
  count_plant,
  last_explored,
}) => {
  const chunk = new Chunk({
    name,
    owner,
    count_chunk,
    count_plant,
    last_explored,
  });

  return chunk.save();
};

// deletes a Chunk in the database.
const deleteChunk = (id) => Chunk.find({ _id: id })
  .deleteOne().exec().catch((err) => console.error(err));

// updates a Chunk instance with new Chunk data.
const updateChunk = (id, newChunk) => Chunk.findOneAndUpdate({ _id: id },
  { ...newChunk })
  .exec().catch((err) => console.error(err));

// get Chunks from the database.
const getChunks = () => Chunk.find()
  .then((data) => data)
  .catch((err) => console.error(err));

module.exports = {
  addChunk,
  getChunks,
  updateChunk,
  deleteChunk,
};
