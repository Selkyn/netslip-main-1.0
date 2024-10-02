const axios = require('axios');
const request = require('request');



exports.searchMovie = async (req, res, next) => {
    // Extraction des paramètres de requête (query, type, page)
    const query = req.query.search;
    const type = req.query.type || 'movie';
    const page = parseInt(req.query.page) || 1;

    if (query && query.length >= 1) {
        const url = `https://www.omdbapi.com/?s=${query}&type=${type}&page=${page}&apikey=563e52c9`;

        try {
            // Envoi de la requête à l'API OMDB et attente de la réponse
            const response = await axios.get(url);
            const data = response.data;

            if (data.Search) {
                const totalResults = parseInt(data.totalResults);
                const totalPages = Math.ceil(totalResults / 10); // Nombre total de pages basé sur 10 résultats par page

                // Rendu de la page des résultats avec les données récupérées
                res.render('resultsPage', {
                    data: data.Search,
                    totalResults: totalResults,
                    currentPage: page,
                    totalPages: totalPages,
                    query: query,
                    type: type
                });
            } else {
                res.render('error', { message: 'Aucun résultat trouvé pour la recherche.' });
            }
        } catch (error) {
            res.render('error', { message: 'Erreur lors de la recherche.' });
        }
    } else {
        res.render('error', { message: 'La recherche doit contenir au moins une lettre.' });
    }
};

exports.getMovieDetails

        

