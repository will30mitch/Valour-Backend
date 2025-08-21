const express = require('express');
const Card = require('../models/Card');
const router = express.Router();

// Get all cards
router.get('/', async (req, res) => {
  const cards = await Card.find();
  res.json(cards);
});

// Add a new card
router.post('/', async (req, res) => {
  const card = new Card(req.body);
  await card.save();
  res.status(201).json(card);
});

module.exports = router;
