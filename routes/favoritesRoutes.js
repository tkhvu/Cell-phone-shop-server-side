const express = require('express');
const router = express.Router();
const { deleteFavorites, addFavorites } = require('../controllers/favoritesController');


router.delete('/deleteFavorites', deleteFavorites);

router.get('/addFavorites', addFavorites)

module.exports = router;
