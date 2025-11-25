const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: Number, required: true },
  atkPts: { type: Number, required: true },
  defPts: { type: Number, required: true },
  type: { type: String, required: true },
  effect: { type: String },
  desc: { type: String },
});

// This will automatically create a "cards" collection in MongoDB
const Card = mongoose.model('Card', cardSchema);

module.exports = Card;