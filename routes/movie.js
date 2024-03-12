const express = require('express');
const router = express.Router();

const movieCtrl = require("../controllers/movie");

router.get('/', movieCtrl.searchMovie);
// router.get("/random-movies", movieCtrl.getRandomMovies)

module.exports = router;