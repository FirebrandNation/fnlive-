"use strict"
const Router = require('express').Router();

const {
    prayerRequest,
    Security,
    Person
} = require('../Controllers/users.js');


Router.get('/search/:method/:searchTerm', (req, res) => {
    let searchEngine = {
        method: '',
        infoLead: req.params.searchTerm
    };
    if (req.params.method === 'email') {
        searchEngine.method = 'byEmail';
    } else {
        searchEngine.method = 'byID'
    };
    var prayerMaker = new Person({
        name: '',
        email: '',
        phone: ''
    });
    prayerMaker.search(searchEngine)
        .then((data) => {
            res.json(data);
        })
        .catch((err) => {
            res.json(err);
        })
})


Router.get('/register/:email/:name/:phone/:password', (req, res) => {

    var prayerMaker = new Person({
        name: req.params.name,
        email: req.params.email,
        phone: req.params.phone,
        password: req.params.password
    });
    prayerMaker.register()
        .then((data) => {

            res.json({
                id:data._id,
                fullName:data.full_name,
                email:data.email,
                phone:data.phone
            });

        })
        .catch((err) => {
            if (err.code === 11000) {
                res.json({
                    status: 'fail',
                    msg: 'Sorry this email is already registered'
                });
            } else {
                res.json({
                    status: 'fail',
                    msg: 'Sorry an error occured'
                });
            }
        });
});


Router.get('/login/:email/:password', (req, res) => {

    var visitor = new Person({
        name: '',
        email: '',
        phone: ''
    });

    var credentials = {
        email: req.params.email,
        password: req.params.password
    }

    visitor.login(credentials)
        .then((feedback) => {
            res.json(feedback);
        })
        .catch((err) => {
            res.json(err);
        })
});

module.exports = Router;