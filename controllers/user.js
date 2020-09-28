'use strict'
//modulos
var bcrypt = require('bcrypt-nodejs');
var fs = require('fs');
var path = require('path');
const { remove } = require('../models/user');

//modelos
var User = require('../models/user');

// libs
var jwt = require('../services/jwt');

function testing(req, res) {
    res.status(200).send({
        message: 'Testing user controller',
        user: req.user
    });

} // end pruebas


// saveUser
function saveUser(req, res) {
    var user = new User();
    var params = req.body;

    if (params.name && params.surname && params.email && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.email = params.email;
        user.role = 'ROLE_USER';
        user.image = params.image;

        User.findOne({ email: user.email.toLowerCase() }, (err, isSetUser) => {
            if (err) {
                res.status(500).send({ message: "error creating user" })
            } else {
                if (!isSetUser) {
                    bcrypt.hash(params.password, null, null, function(err, hash) {
                        user.password = hash;
                        user.save((err, userStored) => {
                            if (err) {
                                res.status(500).send({ message: 'error saving user' });
                            } else {
                                if (!userStored) {
                                    res.status(404).send({ message: 'User could not be saved' });
                                } else {
                                    res.status(200).send({ user: userStored });
                                    res.end();
                                }
                            }

                        });
                    });
                } else {
                    res.status(404).send({ message: 'usuario already exists in database' });
                }
            }
        });
    } else {
        res.status(200).send({
            message: 'Introduce the correct data for user'
        });
    }
} // end saveUser

// login
function login(req, res) {
    var params = req.body;
    var email = params.username;
    var password = params.password;


    User.findOne({ email: email.toLowerCase() }, (err, user) => {
        if (err) {
            res.status(500).send({ message: 'error finding user in database' })
        } else {
            if (user) {
                bcrypt.compare(password, user.password, (err, check) => {
                    if (check) {
                        user.password = "";
                        //if (params.gettoken) {
                        res.status(200).send({
                            user: user,
                            token: jwt.createToken(user)
                        });
                        //} else {
                        //    res.status(200).send({ user });
                        res.end();
                        //}
                    } else {
                        res.status(404).send({ message: 'unable to log in user correctly' });
                    }
                });
            } else {
                res.status(404).send({ message: 'user could not get logged in' });
            }
        }
    });

} // end login


//update user
function updateUser(req, res) {
    var userId = req.params.id;
    var user = JSON.stringify(req.body);
    delete user.password;

    console.log(userId);
    console.log(req._id)
    console.log(req.body._id)

    if (userId != req.body._id) {
        return res.status(500).send({ message: 'you lack permissions to update this user' });
    }

    User.findByIdAndUpdate(userId, req.body, { new: true }, (err, userUpdated) => {
        if (err) {
            res.status(500).send({ message: 'error updating user' });
        } else {
            if (!userUpdated) {
                res.status(404).send({ message: 'User was successfully updated' });
            } else {
                res.status(200).send({ user: userUpdated });
            }
        }
    });
} // end update user

// updloadImage
function updloadImage(req, res) {
    var userId = req.params.id;
    var file_name = "No subido...";

    var file_path;
    var file_split;
    var file_name;

    if (req.files) {
        file_path = req.files.image.path;
        file_split = file_path.split('/');
        file_name = file_split[2];
    }


    var ext_split = file_name.split('\.');
    var file_ext = ext_split[1];

    if (file_ext == 'png' || file_ext == 'jpg' || file_ext == 'jpeg' || file_ext == 'gif') {
        if (userId != req.user.sub) {
            return res.status(500).send({ message: 'you lack permissions to update this user' });
        }

        User.findByIdAndUpdate(userId, { image: file_name }, { new: true }, (err, userUpdated) => {
            if (err) {
                res.status(500).send({ message: "user wasn't found when uptiing" });
            } else {
                if (!userUpdated) {
                    res.status(404).send({ message: "user wasn't stored correctly" });
                } else {
                    res.status(200).send({ user: userUpdated, image: file_name });
                }
            }
        });
    } else {
        fs.unlink(file_path, (err) => {
            if (err) {
                return res.status(500).send({
                    message: 'extension no valida y fichero no guardado ',
                    file_ext: file_ext,
                    file_path: file_path
                });
            } else {
                return res.status(500).send({
                    message: 'extension no valida',
                    file_ext: file_ext,
                    file_path: file_path
                });
            }
        })

    }
} // end uploadImage

// getImageFile
function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.access(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: 'image was not found' });
        }
    });
} // end getImageFile

// getKeepers
function getAdmins(req, res) {
    User.find({ role: 'ROLE_ADMIN' }).exec((err, users) => {
        if (err) {
            res.status(500).send({ message: 'error in call' });
        } else {
            if (!users) {
                res.status(500).send({ message: 'No admins found' });
            } else {
                res.status(200).send({ users });
            }
        }
    });
}

// exports
module.exports = {
    testing,
    saveUser,
    login,
    updateUser,
    updloadImage,
    getImageFile,
    getAdmins
};