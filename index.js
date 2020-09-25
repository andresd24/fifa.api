'use scrict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3333;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/fifa2020', { useNewUrlParser: true })
    .then(() => {
        console.log('connection started OK!')

        app.listen(port, () => {
            console.log('servidor con node y express estan corriendo');
        });
    })
    .catch(err => console.log(err));