const { gql } = require('apollo-server');

module.exports = gql`
  type Player {
    _id: ID!
    username: String!
    name: String!
  }

  type Card {
    _id: ID!
    Card_Names: String!
    LVL: Int!
    ATK_PTS: Int!
    DEF_PTS: Int!
    TYPE: String!
    EFFECT: String
    DESC: String
    }

    type Deck {
    _id: ID!
    cards: [ID!]!
    user: ID!
    name: String
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
    drawnCard: [ID]
    message: String!
    nextPhase: String
    gameState: GameState
  }

  type HandResult {
    hand: ID!
    message: String!
}

  type DeckResult {
    deck: [ID!]   
    cardnames: [String!]
    message: String!
}

input CombatActionInput {
    attackerId: ID!
    defenderId: ID       # null = direct attack
    targetPlayerId: ID!
  }

  type CombatResult {
    success: Boolean!
    message: String!
    gameState: GameState
    nextPhase: String
  }

  scalar JSON

  type Query {
    players: [Player]
    games: [GameSession]
    game(id: ID!): GameSession
    cards(id: ID!): Card
  }

  type Mutation {
    createPlayer(username: String!, password: String!, name: String!): Player
    createGameSession(playerIds: [ID!]!): GameSession
    createDeck(userId: ID!, name: String!, cardIds: [ID!]!): Deck
    addCardToDeck(deckId: ID!, cardId: ID!): Deck
    drawCard(gameId: ID!, playerId: ID!, deckID: ID!): DrawResult
    PlayerHand(gameId: ID!, playerId: ID!, cardId: ID!): HandResult
    PlayerDeck(deckId: ID!): DeckResult
    combatPhase(gameId: ID!,playerId: ID!,action: CombatActionInput!): CombatResult
  }
`;