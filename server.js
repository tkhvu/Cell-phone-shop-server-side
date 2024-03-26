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

const favoritesRoute = require('./routes/favoritesRoutes');
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const mobileRoutes = require('./routes/mobileRoutes');
const cartRoutes = require('./routes/cartRoutes');
const emailRoutes = require('./routes/emailRoutes');
const uploadRoutes = require('./routes/uploadRoutes');


app.use('/api/email', emailRoutes);
app.use('/api/mobile', mobileRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/favorites', favoritesRoute);
app.use('/api/cart', cartRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT);
