'use strict'

//modulos
var fs = require('fs');
var path = require('path');

//modelos
var User = require('../models/user');
var Team = require('../models/team');

// libs
var jwt = require('../services/jwt');

function pruebas(req, res) {
    res.status(200).send({
        message: 'Probando controlador de usuarios y la accion de pruebas',
        user: req.user
    });

} // end pruebas

// saveAnimal
function saveTeam(req, res) {
    var team = new Team();
    var params = req.body;

    if (params.name) {
        team.name = params.name;
        team.country = params.country;
        team.league = params.league;
        team.year = params.year;
        team.user = req.user.sub;
        team.image = "";


        team.save((err, teamStored) => {
            if (err) {
                res.status(500).send({ message: 'error en el servidor' });
            }
            if (!teamStored) {
                res.status(404).send({ message: 'no se ha guardado el animal' });
            } else {
                res.status(200).send({ team: teamStored });
            }
        });
    } else {
        res.status(404).send({ message: 'el nombre es obligatorio' });
    }
}

// getAnimals
function getTeams(req, res) {
    Team.find({}).populate({ path: 'user' }).exec((err, teams) => {
        if (err) {
            res.status(500).send({ message: 'error en la peticion' });
        } else {
            if (!teams) {
                res.status(404).send({ message: 'no hay animales' });
            } else {
                res.status(200).send({ teams });
            }
        }
    });
}

// getAnimal
function getTeam(req, res) {
    var teamId = req.params.id;

    Team.findById(teamId).populate({ path: 'user' }).exec((err, team) => {
        if (err) {
            res.status(500).send({ message: 'error en la peticion' });
        } else {
            if (!team) {
                res.status(404).send({ message: 'el animal no existe' });
            } else {
                res.status(200).send({ team });
            }
        }
    });
}

// updateAnimal
function updateTeam(req, res) {
    var teamId = req.params.id;
    var update = req.body;

    Tean.findByIdAndUpdate(teamId, update, { new: true }, (err, teamUpdated) => {
        if (err) {
            res.status(500).send({ message: 'error en la peticion' });
        } else {
            if (!teamUpdated) {
                res.status(404).send({ message: 'no se ha actualizado el animal' });
            } else {
                res.status(200).send({ team: teamUpdated });
            }
        }
    });
}


// updloadImage
function updloadImage(req, res) {
    var teamId = req.params.id;
    var file_name = "Not uploaded...";

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

        Team.findByIdAndUpdate(teamId, { image: file_name }, { new: true }, (err, teamUpdated) => {
            if (err) {
                res.status(500).send({ message: 'error actualizing team' });
            } else {
                if (!teamUpdated) {
                    res.status(404).send({ message: 'Team image could not be actualized' });
                } else {
                    res.status(200).send({ team: teamUpdated, image: file_name });
                }
            }
        });
    } else {
        fs.unlink(file_path, (err) => {
            if (err) {
                return res.status(500).send({
                    message: 'extention not valid ',
                    file_ext: file_ext,
                    file_path: file_path
                });
            } else {
                return res.status(500).send({
                    message: 'extention not valid ',
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
    var path_file = './uploads/teams/' + imageFile;

    fs.access(path_file, function(exists) {
        if (exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(404).send({ message: "team image wasn't found" });
        }
    });
} // end getImageFile

// deleteAnimal
function deleteTeam(req, res) {
    var teamId = req.params.id;

    Team.findByIdAndRemove(teamId, (err, teamRemoved) => {
        if (err) {
            res.status(500).send({ message: "request error" });
        } else {
            if (!teamRemoved) {
                res.status(404).send({ message: "couldn't remove team from db" });
            } else {
                res.status(200).send({ team: teamRemoved });
            }
        }
    });
}

// exports
module.exports = {
    pruebas,
    saveTeam,
    getTeams,
    getTeam,
    updateTeam,
    updloadImage,
    getImageFile,
    deleteTeam
};