require('../index');
const mongoose = require('mongoose');

// The schema for the User model.
const UserSchema = new mongoose.Schema({
  id: Number,
  idUser: String,
  isFirst: Boolean,
});

// creating a new mongoose model instance for User.
const User = mongoose.model('User', UserSchema);

// adds a User to the database.
const addUser = (id) => {
  const user = {
    idUser: id,
    isFirst: false,
  };

  return User.create(user).catch((err) => console.error(err));
};

// kills a User in the database.
const killUser = (id) => User.find({ idUser: id })
  .deleteMany().then((data) => {
    console.log(data);
  })
  .catch((err) => console.error(err));

// updates a User instance with new User data.
const updateUser = (id, bool) => User.findOneAndUpdate({ _id: id },
  { isFirst: bool })
  .exec().catch((err) => console.error(err));

// get Users from the database.
const getUser = () => User.find()
  .then((data) => data)
  .catch((err) => console.error(err));

// clear all Users from the database.
// (NOTE: only meant for cleaning multiple floating records in database)
const clearUsers = () => User.deleteMany().exec().catch((err) => console.error(err));

module.exports = {
  addUser,
  killUser,
  updateUser,
  getUser,
  clearUsers,
};
