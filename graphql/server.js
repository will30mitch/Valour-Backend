require('dotenv').config();

const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose');
const typeDefs = require('./schema');
const resolvers = require('./resolver');

// ✅ models live one level up from /graphql
const Card = require('../models/Cards');
const GameSession = require('../models/GameSession');
const User = require('../models/User');
const Deck = require('../models/Deck');
const Hand = require('../models/Hand');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/valour-tcg';
const PORT = process.env.PORT || 4000;

console.log('🔍 Using Mongo URI:', MONGO_URI);

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // ✅ use the existing Card model import
    const count = await Card.countDocuments();
    const sample = await Card.findOne({});
    console.log('🔍 Card docs in this DB:', count);
    console.log(
      '🔍 Sample card from this DB:',
      sample && sample._id && sample._id.toString()
    );

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({
        models: {
          Card,
          GameSession,
          User,
          Deck,
          Hand,
        },
      }),
      introspection: true,
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
