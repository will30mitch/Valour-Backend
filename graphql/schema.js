const { gql } = require('apollo-server');

module.exports = gql`
  type Player {
    _id: ID!
    username: String!
    name: String!
  }

  type GameState {
    phase: String!
    playerStates: JSON
  }

  type GameSession {
    _id: ID!
    players: [Player!]!
    state: GameState!
  }

  type DrawResult {
    drawnCard: String
    message: String!
    nextPhase: String
    gameState: GameState
  }

  scalar JSON

  type Query {
    players: [Player]
    games: [GameSession]
    game(id: ID!): GameSession
  }

  type Mutation {
    createPlayer(username: String!, password: String!, name: String!): Player
    createGameSession(playerIds: [ID!]!): GameSession
    drawCard(gameId: ID!, playerId: ID!): DrawResult
  }
`;