// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const axios = require('axios');


exports.register = async (req, res, next) => {
    try {
        const userData = {
            email: req.body.email,
            password: req.body.password,
        };

        const response = await axios.post('http://localhost:4000/api/auth/signup', userData);

        if (response.status === 201) {
            console.log('User registered successfully:', response.data.message);
            res.status(201).send('User registered successfully');
        } else {
            console.error('Error registering user:', response.data.message);
            res.status(response.status).send('Error registering user');
        }
    } catch (error) {
        console.error('Error registering user:', error.response ? error.response.data : error.message);
        res.status(500).send('Error registering user');
    }
}