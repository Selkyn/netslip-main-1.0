const express = require('express');
const request = require('request');
const jwt = require('jsonwebtoken')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const app = express();
const axios = require('axios');


//importation de mes modules de routes
const usersRoutes = require('./routes/user');
const movieRoutes = require('./routes/movie');
const favoriteRoutes = require('./routes/favorite');

app.set('view engine', 'ejs');

app.use(cookieParser());


//middlewares pour analyser les données au format JSON et URL-encoded dans le corps des requêtes.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//configuration d'express-session
app.use(session({
    secret: 'RANDOM_TOKEN_SECRET',
    resave: false,
    saveUninitialized: true
}))

// Middleware pour les informations de session, afin de les rendre disponible dans mes views
app.use((req, res, next) => {
    res.locals.userToken = req.session.token;
    res.locals.userEmail = req.session.email;
    res.locals.userId = req.session.userId;
    next();
});

app.get('/', function(req, res){
    res.render('index');
});

app.get('/auth', (req, res, next) => {
    res.render('auth');
})

app.get('/favorites', (req, res) => {
    res.render('favorites', { favorites: [] }); 
});



//middleware qui configure les headers CORS pour permettre les requêtes depuis n'importe quelle origine ('*') et définir les méthodes et headers autorisés.
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//ROUTES
app.use('/user', usersRoutes);
app.use('/results', movieRoutes)
app.use('/favorite', favoriteRoutes);



module.exports = app;