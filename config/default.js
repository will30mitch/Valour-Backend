module.exports = {
  jwtSecret: process.env.JWT_SECRET || 'replace_this_secret',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/valour-tcg'
};
