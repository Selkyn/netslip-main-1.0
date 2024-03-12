// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const axios = require('axios');



//enregistrer un user
exports.register = async (req, res, next) => {
    try {
        const userData = {
            email: req.body.email,
            password: req.body.password,
        };

        const response = await axios.post('http://localhost:4000/api/auth/signup', userData);

        if (response.status === 201) {
            console.log('Utilisateur enregistré avec succes:', response.data.message);
            res.status(201).redirect('/auth');
            
        } else {
            console.error('Erreur:', response.data.message);
            res.status(response.status).send('Erreur d\'enregistrement d\'utilisateur');
        }
    } catch (error) {
        console.error('Erreur d\'enregistrement d\'utilisateur:', error.response ? error.response.data : error.message);
        res.status(500).send('Erreur d\'enregistrement d\'utilisateur');
    }
}


//se loguer

exports.login = async (req, res) => {
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

        // res.json({ token, email: userEmail, userId: userId });
        res.redirect('/');
        // res.json({ token: jwtToken });
        // res.send(`Bienvenue, ${userEmail} !`);
    } catch (error) {
        // Gérer les erreurs, renvoyer un message d'erreur 
        console.error('Erreur de connexion:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Erreur de connexion' });
    }
};

exports.logout = (req, res) => {
    // req.logout();
    if (req.session) {
      req.session.destroy(function(err) {
        res.redirect('/auth');
      });
    }
    else {
      res.redirect('/auth');
    }
  };