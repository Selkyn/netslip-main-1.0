const axios = require('axios');


//envoyer les favoris vers l'API
exports.postFavorite = async (req, res) => {
    const omdbId = req.params.omdbId;
    // const omdbTitle = req.params.title;
    const userId = req.session.userId
    const formData = req.body;

    // const omdbTitle = formData.title;

    try {
        const response = await axios.post(`http://localhost:4000/api/add-favorite/${omdbId}`, {
             ...formData,
              userId
             });
        res.status(201).json(response.data);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


//recuperer les favoris
exports.getFavorite =  async (req, res) => {
    try {
        const userId = req.session.userId;
        const omdbId = req.body.omdbId;
        const response = await axios.get(`http://localhost:4000/api/get-favorites/${userId}`)

    const favorites = response.data;

const moviesDetails = [];

const getMovieDetails = async (omdbId) => {
    try {
        const movieResponse = await axios.get(`http://www.omdbapi.com/?i=${omdbId}&apikey=563e52c9`);
        return movieResponse.data;
    } catch (error) {
        console.error('Erreur lors de la récupération des détails du film:', error.message);
        return null;
    }
};

for (const favorite of favorites) {
    const movieDetails = await getMovieDetails(favorite.omdbId);
    if (movieDetails) {
        moviesDetails.push(movieDetails);
    }
}

    res.render('favorites', { moviesDetails });
    // res.status(201).json(response.data);
    } catch (error) {
        console.error('Erreur lors de la récupération des favoris:', error.message);
        res.status(500).send('Erreur lors de la récupération des favoris');
    }
    
};

