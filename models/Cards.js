// models/Cards.js
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  Card_Names: { type: String, required: true },
  LVL:       { type: Number, required: true },
  ATK_PTS:   { type: Number, required: true },
  DEF_PTS:   { type: Number, required: true },
  TYPE:      { type: String, required: true },
  EFFECT:    { type: String },
  DESC:      { type: String },
}, {
  collection: 'cards', // makes sure it uses the "cards" collection
});

module.exports = mongoose.model('Card', cardSchema);