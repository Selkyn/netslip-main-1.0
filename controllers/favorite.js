const axios = require('axios');


//envoyer les favoris vers l'API
exports.postFavorite = async (req, res) => {
    const omdbId = req.params.omdbId;
    const token = req.session.token;
    const userId = req.session.userId;

    try {
        const response = await axios.post(
            `http://localhost:4000/api/favorite/add-favorite/${omdbId}`,
            { userId }, // Inclus userId dans ma requete
            {
                headers: {
                    Authorization: `Bearer ${token}` 
                    //pour envoyé le token vers l'API afin d'avoir les autorisation
                }
            }
        );
        res.redirect(req.get('referer'));
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


//recuperer les favoris
exports.getFavorite = async (req, res) => {
    try {
        const userId = req.session.userId; //recupere l'id de mon user connecté
        const response = await axios.get(`http://localhost:4000/api/favorite/get-favorites/${userId}`, {
            headers: {
                Authorization: `Bearer ${req.session.token}`
            }
        });
        const favorites = response.data;
        console.log(favorites) 
        //les informations de la reponse de la requete est stocké dans la variable favorites
        const detailedMovies = []; 
        //mon tableau où seront stockés les details des films et l'id du favoris
        const getMovieDetails = async (omdbId) => { 
            //à partir de l'id du film (qui est stocké dans const favorites),
            // on va pouvoir aller chercher les details en se connectant à l'api OMDB
            try {
                const movieResponse = await axios.get(`http://www.omdbapi.com/?i=${omdbId}&plot=full&apikey=563e52c9`);
                return movieResponse.data;
            } catch (error) {
                console.error('Erreur lors de la récupération des détails du film:', error.message);
                return null;
            }
        };

        //boucle sur mon tableau favorites
        for (const favorite of favorites) {
            const movieInfos = await getMovieDetails(favorite.omdbId);
            if (movieInfos) {
                detailedMovies.push({
                    favoriteId: favorite._id,
                    movieDetails: movieInfos,
                });
            }
        }
        console.table(detailedMovies);
        res.render('favorites', { detailedMovies }); // on envoie vers la view favorites avec mon tableau en parametre
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

