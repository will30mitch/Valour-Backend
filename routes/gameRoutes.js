const express = require('express');
const GameSession = require('../models/GameSession');
const router = express.Router();

// Start a new game
router.post('/start', async (req, res) => {
  const { playerIds } = req.body;
  const game = new GameSession({ players: playerIds, state: {}, turn: 0 });
  await game.save();
  res.status(201).json(game);
});

// Get game state
router.get('/:id', async (req, res) => {
  const game = await GameSession.findById(req.params.id);
  res.json(game);
});

// Submit a move (placeholder)
router.post('/:id/move', async (req, res) => {
  // Implement game logic here
  res.json({ message: 'Move processed (placeholder)' });
});

module.exports = router;
