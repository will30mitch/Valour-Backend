const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: String,
  stats: {
    attack: Number,
    defense: Number,
    manaCost: Number
  },
  abilities: [String]
});

module.exports = mongoose.model('Card', CardSchema);
