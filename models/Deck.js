const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card', validator: (arr) => Array.isArray(arr) && arr.length <= 60, message: 'Deck cannot have more than 60 cards.' }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String},
   
}, { timestamps: true});


// This will automatically create a "cards" collection in MongoDB
const Deck = mongoose.model('Deck', deckSchema);

module.exports = Deck;