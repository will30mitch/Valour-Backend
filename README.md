# Valour TCG Backend

This backend is for a Trading Card Game (TCG) using Node.js, Express, and MongoDB. It includes models for cards, users, and game sessions, with REST API endpoints for card management, deck building, game logic, and user authentication.

## Features
- Card, User, and GameSession models (MongoDB)
- REST API for cards, decks, games, and users
- JWT authentication
- Game logic handled server-side

## Getting Started
1. Install dependencies: `npm install`
2. Set up MongoDB and configure connection string in `.env`
3. Start the server: `npm start`

## Folder Structure
- `/models` - Mongoose models for Card, User, GameSession
- `/routes` - Express route handlers
- `/controllers` - Business logic for each route
- `/middleware` - Authentication and other middleware
- `/config` - Configuration files
- `/app.js` - Main Express app

## Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for JWT authentication

## Notes
- Replace placeholder logic and models with your game-specific rules and card data.
- Extend endpoints and models as needed for your TCG features.
# Valour-Backend
