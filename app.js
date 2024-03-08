const express = require('express');
const request = require('request');
const jwt = require('jsonwebtoken')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const app = express();
const axios = require('axios');


const usersRoutes = require('./routes/user');

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




app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.get('/results', function(req, res){
    const query = req.query.search;
    const type = req.query.type || 'movie';
    const page = parseInt(req.query.page, 10) || 1; // Par défaut, la première page

    // Ajoutez une vérification pour la longueur minimale de la requête
    if (query.length >= 1) {
        const itemsPerPage = 10; // Nombre d'éléments par page
        const startIndex = (page - 1) * itemsPerPage;

        const url = `https://www.omdbapi.com/?s=${query}*&type=${type}&page=${page}&apikey=563e52c9`;
        request(url, function(error, response, body){
            if(!error && response.statusCode == 200){
                const data = JSON.parse(body);
                const totalResults = parseInt(data.totalResults, 10);
                const totalPages = Math.ceil(totalResults / itemsPerPage);

                // Ajoutez la propriété 'Results' pour stocker uniquement les résultats de la page actuelle
                data.Results = data.Search.slice(startIndex, startIndex + itemsPerPage);

                res.render('results', {
                    data: data,
                    currentPage: page,
                    totalPages: totalPages,
                    query: query,
                    type: type // Assurez-vous que la variable query est transmise au modèle
                });
            }
        });
    } else {
        // Si la requête est trop courte, vous pouvez rediriger vers une page d'erreur ou renvoyer un message approprié.
        res.render('error', { message: 'La recherche doit contenir au moins trois lettres.' });
    }
});

app.post('/register', async (req, res) => {
    try {
        const userData = {
            email: req.body.email,
            password: req.body.password,
        };

        const response = await axios.post('http://localhost:4000/api/auth/signup', userData);

        if (response.status === 201) {
            console.log('User registered successfully:', response.data.message);
            res.status(201).send('Utilisateur enregistré');
        } else {
            console.error('Error registering user:', response.data.message);
            res.status(response.status).send('Error registering user');
        }
    } catch (error) {
        console.error('Error registering user:', error.response ? error.response.data : error.message);
        res.status(500).send('Error registering user');
    }
});

// app.use('/register', usersRoutes);


app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Effectue une requête à l'API-USER pour l'authentification
        const response = await axios.post('http://localhost:4000/api/auth/login', {
            email: email,
            password: password
        });

        // Récupère le token JWT depuis la réponse
        // const jwtToken = response.data.token;
        // const userEmail = response.data.email;
        const { token, email: userEmail, userId : userId } = response.data;

        // Stocker le token et l'email dans la session
        req.session.token = token;
        req.session.email = userEmail;
        req.session.userId = userId;

        res.json({ token, email: userEmail, userId: userId });
        // res.json({ token: jwtToken });
        // res.send(`Bienvenue, ${userEmail} !`);
    } catch (error) {
        // Gérer les erreurs, renvoyer un message d'erreur approprié
        console.error('Erreur de connexion:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Erreur de connexion' });
    }
});

// Route pour la déconnexion
app.get('/logout', function(req, res) {
    req.logout();
    if (!req.session) {
      req.session.destroy(function(err) {
        res.redirect('/auth');
      });
    }
    else {
      res.redirect('/auth');
    }
  });
// app.post('/logout', async (req, res) => {
//     try {
//         // Effectuez une requête DELETE vers votre endpoint de déconnexion dans l'API-USER
//         const response = await axios.delete('http://localhost:4000/api/auth/logout', {
//             withCredentials: true, // Assurez-vous d'inclure les cookies dans la requête
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
  app.post('/add-favorite/:omdbId', async (req, res) => {
    const userId = req.session.userId;
    const omdbId = req.params.omdbId;
  
    try {
      // Faites une requête à votre API-USER pour ajouter le film aux favoris de l'utilisateur
      await axios.post(`http://localhost:4000/api/add-favorite/${userId}/${omdbId}`);
  
      res.status(200).send('Film ajouté aux favoris avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error.message);
      res.status(500).send('Erreur lors de l\'ajout aux favoris');
    }
});

// app.use((req, res) => {
//     res.json({ message : 'votre requete a bien été recu'})
// })
module.exports = app;