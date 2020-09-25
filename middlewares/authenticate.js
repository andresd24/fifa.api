'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var express = require('express');

var app = express();
var secret = 'secret_key_for_fifa_2020_application_for_testing';

exports.ensureAuth = (req, res, next) => {

    if (!req.headers.token) {
        return res.status(403).send({ message: 'the request has no authentication header' });
    }

    var token = req.headers.token.replace(/['"]+/g, '');

    try {
        var payload = jwt.decode(token, secret);

        if (payload.exp <= moment().unix()) {
            return res.status(401).send({
                message: 'the token has expired'
            });

        }
    } catch (ex) {
        return res.status(404).send({
            message: 'the token is invalid'
        });
    }

    req.user = payload;

    next();
};