const express = require('express');
const app = express()
require('dotenv').config({ path: "./config.env" });
const cors = require('cors');
const corsOptions = {
  credentials: true,
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : []
}
app.use(cors(corsOptions))
app.use(express.json());
const cookieParser = require('cookie-parser');
app.use(cookieParser())
const questionsRoute = require('./routes/questions');




app.use('/', questionsRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT);
