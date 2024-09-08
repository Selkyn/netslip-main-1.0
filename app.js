const express = require('express');
const session = require('express-session');
const app = express();

const cookieParser = require('cookie-parser')


//importation de mes modules de routes
const authRoutes = require('./routes/auth');
const movieRoutes = require('./routes/movie');
const favoriteRoutes = require('./routes/favorite');

app.set('view engine', 'ejs');

// app.use(cookieParser());


//middlewares pour analyser les données au format JSON et URL-encoded dans le corps des requêtes.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//configuration d'express-session
app.use(session({
    secret: 'RANDOM_TOKEN_SECRET',
    resave: false,
    saveUninitialized: true
}))

// Middleware pour les informations de session,
// afin de les rendre disponible dans mes views
app.use((req, res, next) => {
    res.locals.userToken = req.session.token;
    res.locals.userEmail = req.session.email;
    res.locals.userId = req.session.userId;
    res.locals.roles = req.session.roles;
    res.locals.pseudo = req.session.pseudo;
    res.locals.successMessage = req.session.message;
    next();
});

app.use((req, res, next) => {
    // Clear the session messages after they are made available to the views
    req.session.message = null;
    req.session.error = null;
    next();
});

app.get('/', function(req, res){
    res.render('index');
});

app.get('/auth', (req, res) => {
    res.render('auth');
});

// app.get('/favorites', (req, res) => {
//     res.render('favorites', { favorites: [] }); 
// });





//ROUTES
app.use('/auth', authRoutes);
app.use('/results', movieRoutes)
app.use('/favorite', favoriteRoutes);



module.exports = app;