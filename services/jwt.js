'use strict'

var jwt = require("jwt-simple");
var moment = require("moment");
var secret = 'secret_key_for_fifa_2020_application_for_testing';

exports.createToken = function(user) {
    var payload = {
        sub: user._id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().unix(30, 'days').unix
    };

    return jwt.encode(payload, secret);
};