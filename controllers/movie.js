const axios = require('axios');
const request = require('request');


exports.searchMovie = (req, res, next) => {
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

                data.Results = data.Search.slice(startIndex, startIndex + itemsPerPage);

                res.render('results', {
                    data: data,
                    currentPage: page,
                    totalPages: totalPages,
                    query: query,
                    type: type 
                });
            }
        });
    } else {
        // Si la requête est trop courte, 
        res.render('error', { message: 'La recherche doit contenir au moins trois lettres.' });
    }
};