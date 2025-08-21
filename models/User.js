const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  deck: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
  collection: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
  stats: {
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model('User', UserSchema);
