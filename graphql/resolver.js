const { drawPhase } = require('../phases/drawPhase');
const { combatPhase } = require('../phases/combatPhase');
const User = require('../models/User');
const GameSession = require('../models/GameSession');
const Card = require('../models/Cards');
const Deck = require('../models/Deck');
const Hand = require('../models/Hand');

module.exports = {
  Query: {
    players: async () => {
      try {
        return await User.find({});
      } catch (error) {
        throw new Error(`Failed to fetch players: ${error.message}`);
      }
    },
    games: async () => {
      try {
        return await GameSession.find({}).populate('players');
      } catch (error) {
        throw new Error(`Failed to fetch games: ${error.message}`);
      }
    },
    game: async (_, { id }) => {
      try {
        const game = await GameSession.findById(id).populate('players');
        if (!game) throw new Error('Game not found');
        return game;
      } catch (error) {
        throw new Error(`Failed to fetch game: ${error.message}`);
      }
    },
    cards: async (_, { id }) => {
      try {
        const card = await Card.findById(id);
        if (!card) throw new Error('Card not found');
        return card;
      } catch (error) {
        throw new Error(`Failed to fetch card: ${error.message}`);
      }
    },
  },
  
  Mutation: {
    createPlayer: async (_, { username, password, name }) => {
      try {
        const existingPlayer = await User.findOne({ username });
        if (existingPlayer) {
          throw new Error('Username already taken');
        }
        
        const player = new User({ username, password, name });
        await player.save();
        return player;
      } catch (error) {
        throw new Error(`Failed to create player: ${error.message}`);
      }
    },

    createGameSession: async (_, { playerIds }) => {
      try {
        // Verify all players exist
        const players = await User.find({ _id: { $in: playerIds } });
        if (players.length !== playerIds.length) {
          throw new Error('One or more players not found');
        }

        // Get some random cards for initial deck
        const cards = await Card.aggregate([{ $sample: { size: 30 } }]);
        const deckIds = cards.map(card => card._id.toString());

        const newGame = new GameSession({
          players: playerIds,
          state: {
            phase: 'initial',
            playerStates: playerIds.reduce((acc, playerId) => ({
              ...acc,
              [playerId]: {
                deck: deckIds,
                hand: [],
                discard: []
              }
            }), {})
          }
        });

        await newGame.save();
        return await newGame.populate('players');
      } catch (error) {
        throw new Error(`Failed to create game session: ${error.message}`);
      }
    },

    createDeck: async (_, { userId, name, cardIds }) => {
      try {
        const user = await User.findById(userId);
        if (!user) {
          throw new Error('User not found');
        }
        const deck = new Deck({
          user: userId,
          name,
          cards: cardIds
        });
        await deck.save();
        return deck;
      } catch (error) {
        throw new Error(`Failed to create deck: ${error.message}`);
      }               
    },

  drawCard: async (_, { gameId, playerId, deckID }) => {
  try {
    // Call drawPhase with deckID
    const { drawnCard, nextPhase, game } = await drawPhase(gameId, playerId, deckID);

    return {
      drawnCard: [drawnCard._id.toString()],       // matches DrawResult.drawnCard: [ID]
      message: `Drew ${drawnCard.name}`,
      nextPhase,
      gameState: {
        phase: game.state.phase,
        playerStates: game.state.playerStates,
      },
    };
  } catch (error) {
    // You *can* throw instead if you don't want drawnCard: null on errors
    return {
      drawnCard: null,
      message: error.message,
      nextPhase: null,
      gameState: null,
    };
  }
},


    PlayerDeck: async (_, { deckId }) => {
     try {
        const deck = await Deck.findById(deckId);
        if (!deck) {
          throw new Error('Deck not found');
        }
        return {
          deck: deck.cards,
          message: 'Deck retrieved successfully'
        };
      } catch (error) {
        throw new Error(`Failed to retrieve deck: ${error.message}`);
    }
  },
combatPhase: async (_, { gameId, playerId, action }) => {
    try {
      const { game, nextPhase, message } = await combatPhase(gameId, playerId, action);

      return {
        success: true,
        message,
        gameState: {
          phase: game.state.phase,
          playerStates: game.state.playerStates,
        },
        nextPhase,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        gameState: null,
        nextPhase: null,
      };
    }

  }
}
};