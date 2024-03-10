const express = require('express');
const router = express.Router();

const favoriteCtrl = require ("../controllers/favorite");

router.post('/add-favorite/:omdbId', favoriteCtrl.postFavorite);
router.get('/get-favorites', favoriteCtrl.getFavorite);

module.exports = router;