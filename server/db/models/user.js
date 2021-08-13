require('../index');
const mongoose = require('mongoose');

// The schema for the User model.
const UserSchema = mongoose.Schema({
  id: Number,
  idUser: Number,
});

// creating a new mongoose model instance for User.
const User = new mongoose.Model(UserSchema);

// adds a User to the database.
const addUser = ({
  id,
}) => {
  const user = new User({
    idUser: id,
  });

  return user.save();
};

// kills a User in the database.
const killUser = (id) => User.find({ _id: id })
  .deleteOne().exec().catch((err) => console.error(err));

// updates a User instance with new User data.
const updateUser = (id, newUser) => User.findOneAndUpdate({ _id: id },
  { ...newUser })
  .exec().catch((err) => console.error(err));

// get Users from the database.
const getUser = () => User.find()
  .then((data) => data)
  .catch((err) => console.error(err));

module.exports = {
  addUser,
  killUser,
  updateUser,
  getUser,
};
