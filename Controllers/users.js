"use strict"

//get mongodb models
const UserModel = require('../Models/users.js');
const bcrypt = require('bcrypt');

class Security {
    constructor(plainTextPass, hashedPass) {
        this.password = plainTextPass;
        this.saltRounds = 10;
        this.hashedPass = hashedPass;
    }

    make() {
        return new Promise((resolve, reject) => {
            bcrypt.hash(this.password, this.saltRounds, function(err, hash) {
                if (err) {
                    reject(err)
                } else {
                    resolve(hash);
                }
            });
        });


    }

    isValid({
        password,
        hashedPassword
    }) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, hashedPassword, (err, _isPassValid) => {
                if (err) {
                    console.log(err)
                    reject(err);
                } else {
                    resolve({
                        status: _isPassValid
                    })
                }
            });
        });


    }
}

class Person {
    constructor({name,email,phone,password}){
        this.full_name = name;
        this.email = email;
        this.phone = phone;
        this.password = password
    }

    register() {
        return new Promise((resolve, reject) => {
            let user = this;

            new Security(this.password)
                .make()
                .then((password) => {
                    user.password = password;
                    UserModel.create(user, (err, docs) => {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            console.log(docs);
                            resolve(docs);
                        };
                    });
                })
                .catch((err) => {

                })




        })
    }

    update() {}

    report() {
        return this;
    }

    search({
        method,
        infoLead
    }) {
        return new Promise((resolve, reject) => {
            if (method == 'byEmail') {
                UserModel.find({
                        email: infoLead
                    })
                    .exec((err, docs) => {
                        if (err) {
                            reject({
                                found: false,
                                err: err
                            });
                        } else {
                            if (docs.length > 0) {
                                resolve({
                                    id: docs[0]._id,
                                    phone: docs[0].phone,
                                    email: docs[0].email
                                })
                            } else {
                                reject({
                                    found: false,
                                    err: err
                                });
                            }
                        }
                    });
            } else if (method == 'byID') {
                UserModel.find({
                        _id: infoLead
                    })
                    .exec((err, docs) => {
                        if (err) {
                            reject({
                                found: false,
                                err: err
                            });
                        } else {
                            if (docs.length > 0) {
                                resolve({
                                    id: docs[0]._id,
                                    phone: docs[0].phone,
                                    email: docs[0].email
                                })
                            } else {
                                reject({
                                    found: false,
                                    err: err
                                });
                            }
                        }
                    });
            } else {
                reject({
                    found: false,
                    err: err
                });
            }
        });
    }

    login({
        email,
        password
    }) {

        return new Promise((resolve, reject) => {
            UserModel.find({
                    email: email
                })
                .exec((err, docs) => {
                    if (err) {
                        reject({
                            found: false,
                            err: err
                        });
                    } else {
                        if (docs.length > 0) {

                            let passCombination = {
                                password: password,
                                hashedPassword: docs[0].password
                            }

                            let x = new Security();

                            x.isValid(passCombination)
                                .then((feedback) => {
                                    if (feedback.status) {
                                        resolve({
                                            id: docs[0]._id,
                                            phone: docs[0].phone,
                                            email: docs[0].email
                                        })
                                    } else {
                                        reject({
                                            found: false,
                                            err: err
                                        });
                                    }
                                })
                                .catch((err) => {

                                })

                        } else {
                            reject({
                                found: false,
                                err: err
                            });
                        }
                    }
                });
        });
    }
    isRegistered() {}
}

class prayerRequest {
    constructor(message, owner) {
        this.message = message;
        this.owner = owner;
    }
    add() {}
}





module.exports = {
    prayerRequest,
    Security,
    Person
}