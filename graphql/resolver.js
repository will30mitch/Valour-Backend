const { drawPhase } = require('../phases/drawPhase');
const GameSession = require('../models/GameSession');
const User = require('../models/User');
const Card = require('../models/Cards');

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
    }
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

    drawCard: async (_, { gameId, playerId }) => {
      try {
        const result = await drawPhase(gameId, playerId);
        const drawnCard = await Card.findById(result.drawnCardId);
        
        if (!drawnCard) {
          throw new Error('Drawn card not found in database');
        }

        return {
          drawnCard: drawnCard.name,
          message: `Drew ${drawnCard.name}`,
          nextPhase: result.nextPhase,
          gameState: {
            phase: result.game.state.phase,
            playerStates: result.game.state.playerStates
          }
        };
      } catch (error) {
        return {
          drawnCard: null,
          message: error.message,
          nextPhase: null,
          gameState: null
        };
      }
    }
  }
};