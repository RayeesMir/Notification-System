/**
 * Created by mir on 25/12/16.
 */

var path = require('path');
var socketioJwt = require('socketio-jwt');
var db = require(path.resolve('./config'));
var userSocket = require(path.resolve('./app/controllers/userSocket'));
var tokenSettings = db.getTokenSettings('dev');
var secret = tokenSettings.secret;

module.exports = function (io) {
    //token Validation for socket connections
    io.on('connection', socketioJwt.authorize({
        secret: secret,
        timeout: 15000
    })).on('authenticated', function (socket) {
        socket.connectDate = new Date();
        socket.ip = (socket.handshake.address) ? socket.handshake.address : null;
        //register client socket in system
        userSocket.registerClient(socket);
        socket.on('disconnect', function () {
            userSocket.disconnect(socket);
        })
    });
};