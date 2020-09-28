'use strict'

var express = require('express');
var UserController = require('../controllers/user');

var api = express.Router();
var md_auth = require('../middlewares/authenticate');

var multipart = require('connect-multiparty');
var md_updload = multipart({ uploadDir: './uploads/users' });

api.get('/testing', md_auth.ensureAuth, UserController.testing);
api.post('/register', UserController.saveUser);
api.post('/login', UserController.login);
api.put('/update-user/:id', UserController.updateUser);
api.post('/upload-image-user/:id', [md_auth.ensureAuth, md_updload], UserController.updloadImage);
api.get('/get-image-file/:imageFile', UserController.getImageFile);
api.get('/admins', UserController.getAdmins);

module.exports = api;