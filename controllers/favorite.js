const axios = require('axios');


//envoyer les favoris vers l'API
exports.postFavorite = async (req, res) => {
    const omdbId = req.params.omdbId;
    // const omdbTitle = req.params.title;
    const token = req.session.token
    const userId = req.session.userId
    const formData = req.body;
console.log(token);
    // const omdbTitle = formData.title;

    try {
        const response = await axios.post(
            `http://localhost:4000/api/favorite/add-favorite/${omdbId}`,
            { ...formData, userId }, // Inclus userId dans ma requete
            {
                headers: {
                    Authorization: `Bearer ${token}` //pour envoyé le token vers l'API afin d'avoir les autorisation
                }
            }
        );
             console.log(req.session.token)
             res.redirect(req.get('referer'));
        // res.status(201).json(response.data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


//recuperer les favoris
exports.getFavorite = async (req, res) => {
    try {
        const userId = req.session.userId; //recupere l'id de mon user connecté
        const omdbId = req.body.omdbId;
        const response = await axios.get(`http://localhost:4000/api/favorite/get-favorites/${userId}`, {
            headers: {
                Authorization: `Bearer ${req.session.token}`
            }
        });
        const favorites = response.data; //les informations de la reponse de la requete est stocké dans la variable favorites

        const moviesDetails = []; //mon tableau où seront stocké les films et donc avoir les details

        const getMovieDetails = async (omdbId) => { //à partir de l'id du film (qui est stocké dans ma table favoris), on va pouvoir aller chercher les details en se connectant à l'api OMDB
            try {
                const movieResponse = await axios.get(`http://www.omdbapi.com/?i=${omdbId}&apikey=563e52c9`);
                return movieResponse.data;
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du film:', error.message);
                return null;
            }
        };

        //boule sur mon tableau favorites
        for (const favorite of favorites) {
            const movieDetails = await getMovieDetails(favorite.omdbId, favorite._id);
            if (movieDetails) {
                moviesDetails.push({
                    favoriteId: favorite._id,
                    movieDetails: movieDetails,
                });
            }
        }

        res.render('favorites', { moviesDetails }); // on envoie vers la view favorites avec les details du film en parametre
        // res.status(201).json(response.data);
    } catch (error) {
        console.error('Erreur lors de la récupération des favoris:', error.message);
        res.status(500).send('Erreur lors de la récupération des favoris');
    }

};


//effacer mes favoris
exports.deleteFavorite = async (req, res) => {
    // const favoriteId = Favorite._id;
    const favoriteId = req.params.favoriteId;
    try {
        const response = await axios.delete(`http://localhost:4000/api/favorite/delete-favorite/${favoriteId}`, {
            headers: {
                Authorization: `Bearer ${req.session.token}`
            }
        })
        res.redirect('/favorite/get-favorites');
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

