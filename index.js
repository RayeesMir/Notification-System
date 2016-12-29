'use strict';
var path = require('path');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = require('./config');
var port = process.env.PORT || 3000;
mongoose.Promise = require('bluebird');
mongoose.connect(db.getConnectionString('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));

app.use(function (req, res, next) {
    res.io=io;
    next();
});

//Serving Index File
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
require('./app/controllers/socketHandler')(io);
require('./app/routes/user')(app);
require('./app/routes/activities')(app);

http.listen(port);

console.log('listining on Port => ', port);

exports = module.exports = app;