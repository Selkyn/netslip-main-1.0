// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const axios = require('axios');



//enregistrer un user
exports.register = async (req, res, next) => {
    try {
        const userData = {
            email: req.body.email,
            password: req.body.password,
            pseudo: req.body.pseudo
        };

        const response = await axios.post('http://localhost:4000/api/auth/signup', userData);

        if (response.status === 201) {
            req.session.message = response.data.message;
            res.redirect('/auth');
            
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
        // Effectue une requête à l'API pour l'authentification
        const response = await axios.post('http://localhost:4000/api/auth/login', {
            email: email,
            password: password
        });

        // les informations depuis la réponse
        const { token, email: userEmail, userId : userId, roles, pseudo } = response.data;

        // Stocker les informations dans la session
        req.session.token = token;
        req.session.email = userEmail;
        req.session.userId = userId;
        req.session.roles = roles;
        req.session.pseudo = pseudo;

        res.redirect('/');
    } catch (error) {
        // Gérer les erreurs, renvoyer un message d'erreur 
        const errorMessage = error.response ? error.response.data.message : 'Erreur de connexion';
        res.render('auth', { errorMessage });
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

  exports.showAuthPage = (req, res) => {
    const message = req.session.message;
    const error = req.session.error;

    res.render('auth', { successMessage: message, errorMessage: error });
};