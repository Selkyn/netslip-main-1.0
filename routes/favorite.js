const express = require('express');
// const auth = require('../middleware/auth');
const router = express.Router();
// const auth = require('../middleware/auth');
// const auth = require('../middleware/auth');

const favoriteCtrl = require ("../controllers/favorite");

router.post('/add-favorite/:omdbId', favoriteCtrl.postFavorite);
router.get('/get-favorites', favoriteCtrl.getFavorite);
router.post('/delete-favorite/:favoriteId', favoriteCtrl.deleteFavorite);


module.exports = router;