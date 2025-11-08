require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./schema');
const resolvers = require('./resolver');
const Cards = require('../models/Cards');
const GameSession = require('../models/GameSession');
const User = require('../models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/valour-tcg';
const PORT = process.env.PORT || 4000;

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connected to MongoDB');

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({
        models: {
          Cards,
          GameSession,
          User
        }
      }),
      introspection: true
    });

    const { url } = await server.listen({ port: PORT });
    console.log(`🚀 Server ready at ${url}`);
  } catch (err) {
    console.error('❌ Server failed to start:', err);
    process.exit(1);
  }
}

start().catch((err) => {
  console.error('Server failed to start:', err);
});