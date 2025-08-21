require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cardRoutes = require('./routes/cardRoutes');
const userRoutes = require('./routes/userRoutes');
const gameRoutes = require('./routes/gameRoutes');
const authMiddleware = require('./middleware/auth');

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use('/api/cards', cardRoutes);
app.use('/api/users', userRoutes);
app.use('/api/games', authMiddleware, gameRoutes);

app.get('/', (req, res) => res.send('Valour TCG Backend Running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
