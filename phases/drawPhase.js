const GameSession = require('../models/GameSession');
const Card = require('../models/Cards');
const Deck = require('../models/Deck');
const mongoose = require('mongoose');


async function drawPhase(gameId, playerId, deckId) {
  try {
    const game = await GameSession.findById(gameId);
    if (!game) {
      throw new Error('Game session not found');
    }

    game.state = game.state || {};
    game.state.playerStates = game.state.playerStates || {};

    const playerState = game.state.playerStates[playerId];
    if (!playerState) {
      throw new Error('Player not found in game');
    }

    // 🔹 Use the deckID passed from GraphQL
    const deck = await Deck.findById(deckId);
    if (!deck) throw new Error('Deck not found.');
    if (!deck.cards || deck.cards.length === 0) {
      throw new Error('Deck has no cards.');
    }

    // Pick a random card ID from the deck.cards array
    const randomIndex = Math.floor(Math.random() * deck.cards.length);
    const drawnCardId = deck.cards[randomIndex];

    // Fetch that Card document
    const drawnCard = await Card.findById(drawnCardId);
    if (!drawnCard) throw new Error('Card not found in DB.');

    // Push to player's hand
    playerState.hand = playerState.hand || [];
    playerState.hand.push(drawnCard._id.toString());

    // Advance phase
    game.state.phase = 'main';
    await game.save();

    // 👉 Return the card itself and game state
    return {
      drawnCard,                        // full Card doc
      nextPhase: game.state.phase,
      game
    };

  } catch (error) {
    console.error('Draw phase error:', error);
    throw error;
  }
}

module.exports = { drawPhase };
