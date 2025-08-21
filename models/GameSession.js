const mongoose = require('mongoose');

const GameSessionSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  state: Object, // Store game state (board, hands, etc.)
  turn: Number,
  winner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('GameSession', GameSessionSchema);
