require('dotenv').config();
const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/valour-tcg';

async function migrateCards() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get the database instance
    const db = mongoose.connection.db;

    // Run the migration
    const result = await db.collection('cards').updateMany(
      {},
      [
        {
          $set: {
            name:  { $ifNull: ["$name", "$Card Names"] },
            level: { $toInt: { $ifNull: ["$level", "$LVL"] } },
            atkPts:{ $toInt: { $ifNull: ["$atkPts", "$ATK PTS"] } },
            defPts:{ $toInt: { $ifNull: ["$defPts", "$DEF PTS"] } },
            type:  { $ifNull: ["$type", "$TYPE"] },
            effect:{ $ifNull: ["$effect", "$EFFECT"] },
            desc:  { $ifNull: ["$desc", "$DESC"] },
          }
        },
        {
          $unset: ["Card Names","LVL","ATK PTS","DEF PTS","TYPE","EFFECT","DESC"]
        }
      ]
    );

    console.log(`✅ Migration complete! Modified ${result.modifiedCount} documents`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    // Close the connection
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Run the migration
migrateCards().catch(console.error);