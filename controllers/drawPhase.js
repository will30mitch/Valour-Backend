const GameSession = require('../models/GameSession');
const User = require('../models/User');
const Card = require('../models/Card');

// Draw Phase Controller
async function drawPhase(gameSessionId, playerId) {
    const game = await GameSession.findById(gameSessionId).populate('players');
    if (!game) throw new Error('Game session not found');
}

    