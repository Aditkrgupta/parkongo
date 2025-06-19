const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser'); // ✅ ADDED
require('dotenv').config();

const authRouter = require('./Routers/authRouter');
const app = express();
const PORT = 3000;

// ✅ CORS setup
app.use(cors({
  origin: 'http://localhost:3000',  // Make sure this matches exactly where frontend runs
  credentials: true
}));

// ✅ Middleware
app.use(express.json());
app.use(cookieParser()); // ✅ REQUIRED for reading Authorization from cookies

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.use('/api/auth', authRouter);

// Static files
app.use(express.static(path.join(__dirname)));

// HTML Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/signup.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'signup.html'));
});
app.get('/register', (req, res) => {
  res.render('register', { apiKey: process.env.API_KEY });
});
app.get('/search', (req, res) => {
  res.render('search', { apiKey: process.env.API_KEY });
});
app.get('/show', (req, res) => {
  res.render('show', { apiKey: process.env.API_KEY });
});

// MongoDB + Server Start
mongoose.connect('mongodb://127.0.0.1:27017/parkongo').then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running at http://127.0.0.1:${PORT}`));
}).catch((err) => console.error('DB Error:', err));
