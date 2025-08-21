# Vallour TCG Backend

A comprehensive backend for a Trading Card Game (TCG) built with Node.js, Express, TypeScript, and PostgreSQL. This backend provides the infrastructure for storing and managing game logic, player data, card collections, and real-time game sessions.

## Features

- **User Authentication**: JWT-based authentication with registration and login
- **Card Management**: Complete card database with collections and deck building
- **Game Sessions**: Real-time game state management with Socket.IO
- **Player Statistics**: Win/loss tracking, experience, and leaderboards
- **Database Storage**: PostgreSQL with Knex.js for migrations and queries
- **API Endpoints**: RESTful API for all game operations
- **Real-time Communication**: WebSocket support for live game updates

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Knex.js ORM
- **Real-time**: Socket.IO
- **Authentication**: JWT with bcrypt
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate limiting

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Vallour_Backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=3000
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=vallour_tcg
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   ```

4. **Set up the database**
   ```bash
   # Create the database
   createdb vallour_tcg
   
   # Run migrations
   npm run migrate
   
   # Seed with sample data
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## Database Schema

### Tables

- **users**: Player accounts and authentication
- **cards**: Card definitions and properties
- **user_cards**: Player card collections
- **games**: Game sessions and metadata
- **game_players**: Players in games with their state
- **game_actions**: Game action history for replays

### Key Relationships

- Users have many cards (through user_cards)
- Games have many players (through game_players)
- Games have many actions (through game_actions)

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password

### Cards (`/api/cards`)

- `GET /` - Get all cards (with filters)
- `GET /:id` - Get card by ID
- `GET /collection/me` - Get user's collection
- `POST /collection/add` - Add cards to collection
- `POST /collection/remove` - Remove cards from collection
- `GET /sets/list` - Get all card sets
- `GET /sets/:setCode` - Get cards by set

### Games (`/api/game`)

- `POST /create` - Create new game
- `POST /join/:gameId` - Join a game
- `POST /start/:gameId` - Start a game
- `GET /state/:gameId` - Get game state
- `GET /active` - Get active games
- `POST /concede/:gameId` - Concede game
- `GET /history` - Get game history

### Users (`/api/users`)

- `GET /:id` - Get user profile
- `GET /:id/stats` - Get user statistics
- `GET /:id/games` - Get user's games
- `GET /leaderboard/global` - Get global leaderboard
- `GET /search/:query` - Search users
- `PUT /:id/update-stats` - Update user stats

## WebSocket Events

### Client to Server

- `authenticate` - Authenticate user
- `join_game` - Join a game room
- `leave_game` - Leave a game room
- `game_action` - Send game action

### Server to Client

- `game_state` - Current game state
- `game_state_update` - Updated game state
- `game_action` - Game action from other player
- `player_disconnected` - Player left the game
- `error` - Error message

## Game Logic Integration

The backend is designed to be a foundation for your game logic. Here's how to integrate your custom game rules:

### 1. Game State Management

The `GameManager` class provides basic game state storage. You can extend it to add your game logic:

```typescript
// In your game logic service
class CustomGameLogic {
  async processAction(gameId: string, action: GameAction): Promise<boolean> {
    // Your game logic here
    const gameState = await this.gameManager.getGameState(gameId);
    
    // Apply your rules
    const isValid = this.validateAction(gameState, action);
    if (!isValid) return false;
    
    // Update game state
    this.applyAction(gameState, action);
    
    // Save to database
    await this.gameManager.recordAction(gameId, action);
    
    return true;
  }
}
```

### 2. Socket.IO Integration

Handle game actions in the SocketHandler:

```typescript
// In SocketHandler.ts
socket.on('game_action', async (data) => {
  const { gameId, actionType, actionData } = data;
  
  // Your game logic validation
  const isValid = await gameLogic.validateAction(gameId, actionType, actionData);
  if (!isValid) {
    socket.emit('error', { message: 'Invalid action' });
    return;
  }
  
  // Process the action
  await gameLogic.processAction(gameId, actionType, actionData);
  
  // Broadcast to other players
  socket.to(gameId).emit('game_action', {
    playerId: userId,
    actionType,
    actionData,
    timestamp: new Date()
  });
});
```

### 3. Database Extensions

Add custom tables for your game-specific data:

```sql
-- Example: Add custom game mechanics table
CREATE TABLE game_mechanics (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES games(id),
  mechanic_type VARCHAR(50),
  data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Development

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

### Project Structure

```
src/
├── config/          # Configuration files
├── database/        # Database migrations and seeds
├── middleware/      # Express middleware
├── routes/          # API route handlers
├── services/        # Business logic services
├── types/           # TypeScript type definitions
└── index.ts         # Main application entry point
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | vallour_tcg |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration | 24h |
| `CORS_ORIGIN` | CORS origin | http://localhost:3000 |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For questions or issues, please open an issue on GitHub or contact the development team. # Valour-Backend
