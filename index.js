const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser'); 
require('dotenv').config();

const authRouter = require('./Routers/authRouter');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: ['http://localhost:3000', 'https://parkongo.onrender.com'],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser()); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use('/api/auth', authRouter);
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});
app.get('/signup', (req, res) => {
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

mongoose.connect(process.env.MONGO_URL)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error('DB Error:', err));
