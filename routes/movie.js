const express = require('express');
const router = express.Router();

const movieCtrl = require("../controllers/movie");

router.get('/', movieCtrl.searchMovie);

module.exports = router;