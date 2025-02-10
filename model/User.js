const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true }
});


const User = mongoose.model('users', userSchema);

module.exports = User;
