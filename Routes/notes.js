"use strict"
const Router = require('express').Router();

const {
    Person
} = require('../Controllers/users.js');

const {
    Notes
} = require('../Controllers/notes.js');


Router.post('/new',(req,res)=>{
    //(ownerEmail,ownerID,content,title,otherRecipient)

    let notes = {
        ownerID : req.body.token,
        ownerEmail : req.body.email,
        content : req.body.notes,
        title : req.body.title,
        otherRecipient : req.body.recipient
    };

    let _Notes = new Notes(notes);
    _Notes.saveNotes();
    _Notes.mailNotes();

});


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