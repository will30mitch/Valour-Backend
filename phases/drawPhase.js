const GameSession = require('../models/GameSession');
const Card = require('../models/Cards');
const mongoose = require('mongoose');

async function drawPhase(gameId, playerId) {
  try {
    const game = await GameSession.findById(gameId);
    if (!game) {
      throw new Error('Game session not found');
    }

    // Initialize state if needed
    game.state = game.state || {};
    game.state.playerStates = game.state.playerStates || {};
    
    const playerState = game.state.playerStates[playerId];
    if (!playerState) {
      throw new Error('Player not found in game');
    }

    // Get random card from database
    const cardCount = await Card.countDocuments();
    if (cardCount === 0) {
      throw new Error('No cards in database');
    }

    const random = Math.floor(Math.random() * cardCount);
    const drawnCard = await Card.findOne().skip(random);

    // Initialize arrays if needed
    playerState.hand = playerState.hand || [];
    playerState.hand.push(drawnCard._id.toString());

    // Update phase
    game.state.phase = 'main';
    await game.save();

    return {
      drawnCardId: drawnCard._id.toString(),
      nextPhase: game.state.phase,
      game
    };
  } catch (error) {
    console.error('Draw phase error:', error);
    throw error;
  }
}

module.exports = { drawPhase };