const express = require('express');
const request = require('request');
const jwt = require('jsonwebtoken')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const app = express();
const axios = require('axios');


const usersRoutes = require('./routes/user');
const movieRoutes = require('./routes/movie');
const favoriteRoutes = require('./routes/favorite');

app.set('view engine', 'ejs');

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use(session({
    secret: 'mon-secret',
    resave: false,
    saveUninitialized: true
}))

// Middleware pour les informations de session
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


// app.get('/logout', async (req, res) => {
//     try {
//         // Effectuez une requête DELETE vers votre endpoint de déconnexion dans l'API-USER
//         const response = await axios.get('http://localhost:4000/api/auth/logout', {
//             // withCredentials: true, // Assurez-vous d'inclure les cookies dans la requête
//         });

//         if (response.status === 200) {
//             // La déconnexion a réussi, vous pouvez rediriger ou faire d'autres actions nécessaires
//             // res.clearCookie('jwt'); // Supprimez le cookie JWT côté client
//             res.redirect('/'); // Redirigez vers la page d'accueil par exemple
//         } else {
//             // La déconnexion a échoué, gérer l'erreur
//             console.error('Erreur lors de la déconnexion:', response.statusText);
//             res.status(response.status).send(response.statusText);
//         }
//     } catch (error) {
//         // Gérer les erreurs, renvoyer un message d'erreur approprié
//         console.error('Erreur lors de la déconnexion:', error.message);
//         res.status(500).send('Erreur lors de la déconnexion');
//     }
// });
// app.use((req, res, next) => {
//     const userId = req.session.userId;
//     if (userId) {
//       res.locals.userId = userId;
//     }
//     next();
//   });

// app.post('/add-favorite/:omdbId', async (req, res) => {
//     const omdbId = req.params.omdbId;
//     // const omdbTitle = req.params.title;
//     const userId = req.session.userId
//     const formData = req.body;

//     // const omdbTitle = formData.title;

//     try {
//         const response = await axios.post(`http://localhost:4000/api/add-favorite/${omdbId}`, {
//              ...formData,
//               userId
//              });
//         res.status(201).json(response.data);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });


// app.get('/get-favorites', async (req, res) => {
//     try {
//         const userId = req.session.userId;
//         const omdbId = req.body.omdbId;
//         const response = await axios.get(`http://localhost:4000/api/get-favorites/${userId}`)

//     const favorites = response.data;

// const moviesDetails = [];

// const getMovieDetails = async (omdbId) => {
//     try {
//         const movieResponse = await axios.get(`http://www.omdbapi.com/?i=${omdbId}&apikey=563e52c9`);
//         return movieResponse.data;
//     } catch (error) {
//         console.error('Erreur lors de la récupération des détails du film:', error.message);
//         return null;
//     }
// };

// for (const favorite of favorites) {
//     const movieDetails = await getMovieDetails(favorite.omdbId);
//     if (movieDetails) {
//         moviesDetails.push(movieDetails);
//     }
// }

//     res.render('favorites', { moviesDetails });
//     // res.status(201).json(response.data);
//     } catch (error) {
//         console.error('Erreur lors de la récupération des favoris:', error.message);
//         res.status(500).send('Erreur lors de la récupération des favoris');
//     }
    
// })

// app.get('/get-favorites/:userId', async (req, res) => {
//     try {
//         // Effectuez une requête à votre API pour récupérer les favoris de l'utilisateur connecté
//         const response = await axios.get('http://localhost:4000/api/get-favorites/:userId', {
//             withCredentials: true, // Assurez-vous d'inclure les cookies dans la requête
//         });

//         // Traitez les favoris récupérés comme vous le souhaitez
//         const favorites = response.data.favorites;
//         res.render('favorites', { favorites });
//     } catch (error) {
//         // Gérez les erreurs
//         console.error('Erreur lors de la récupération des favoris:', error.message);
//         res.status(500).send('Erreur lors de la récupération des favoris');
//     }
// });



//   app.post('/add-favorite/:omdbId', async (req, res) => {
//     const userId = req.session.userId;
//     const omdbId = req.params.omdbId;
  
//     try {
//       // Faites une requête à votre API-USER pour ajouter le film aux favoris de l'utilisateur
//       await axios.post(`http://localhost:4000/api/add-favorite/${userId}/${omdbId}`);
  
//       res.status(200).send('Film ajouté aux favoris avec succès');
//     } catch (error) {
//       console.error('Erreur lors de l\'ajout aux favoris:', error.message);
//       res.status(500).send('Erreur lors de l\'ajout aux favoris');
//     }
// });

// app.use((req, res) => {
//     res.json({ message : 'votre requete a bien été recu'})
// })
module.exports = app;