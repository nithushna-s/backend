require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const routes = require('./routes/routes');
const Subscription=require ('./routes/subscription')
const loggerMiddleware = require('./middlewares/loggerMiddleware');
const mongoString = process.env.DATABASE_URL;
mongoose.connect(mongoString);
const serverless = require('serverless-http');

const database = mongoose.connection;

database.on('error', (error) => {
  console.error('MongoDB connection error:', error);
});

database.once('connected', () => {
  console.log('Database Connected');
});


const app = express();
const port = process.env.PORT || 7000;
app.use(cookieParser());
app.use(loggerMiddleware);
app.use(cors({credentials: true, origin: 'http://localhost:3000'}));
app.use(express.json());

app.use('/api',routes ,Subscription);
app.use('/.netlify/functions/api', router);
module.exports.handler = serverless(app);

app.use((err, req, res, next) => {
  res.status(500).json({ error: err.message });
});