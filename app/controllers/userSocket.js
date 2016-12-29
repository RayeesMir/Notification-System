/**
 * Created by mir on 25/12/16.
 */
'use strict';
var path=require('path');

var ConnectedClients = require(path.resolve('./app/models/connectedClients'));

module.exports = {
    /**
     * Remove client socket details from database
     * @param socket
     */
    disconnect: function (socket) {
        ConnectedClients.removeClient(socket.id)
            .then(function () {
                console.log("socket remove successfully");
            })
            .catch(function (error) {
                console.log(error)
            });
    },
    /**
     * Save Client socket Details in database;
     * @param socket
     */
    registerClient: function (socket) {
        var userId = socket.decoded_token._doc._id;
        ConnectedClients
            .findClientBySocketId(userId,socket.id)
            .then(function (client) {
                if (client)
                    return client;
                else {
                    var newClient=new ConnectedClients({user:userId,socketId:socket.id,socket:socket});
                    return newClient.save();
                }
            })
            .then(function () {
                console.log("registered")
            })
            .catch(function (error) {
                console.log(error)
            });



    }
};

