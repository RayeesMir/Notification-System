/**
 * Created by mir on 25/12/16.
 */
'use strict';
var path = require('path');
var _=require('lodash');
var ActivityModel = require(path.resolve('./app/models/activity'));
var UserModel = require(path.resolve('./app/models/user'));
var ConnectedClients = require(path.resolve('./app/models/connectedClients'));
var helper = require(path.resolve('./helpers/index'));


module.exports = {
    addActivity: function (request, response) {
        var userName, userId, post,message;
        helper.interceptor(request, ["post"], "body")
            .then(function (data) {
                console.log(data)
                userName = data.user.username;
                userId = data.user._id;
                post = data.input.post;
                var activity = {
                    user: userId,
                    name: userName,
                    post: post
                };
                var newActivity = new ActivityModel(activity);
                return newActivity.save();
            })
            .then(function (result) {
                return ActivityModel.populate(result, {path: 'user._id', select: 'name'})
            })
            .then(function (result) {
                message=result;
                return UserModel.findSubscribers(userId);
            })
            .then(function (followers) {
                var subscribers=followers.subscribers;
                var desiredClientId=[];
                _.each(subscribers,function (subscriber) {
                    desiredClientId.push(subscriber.user._id);
                });
                return ConnectedClients.findClientGroup(desiredClientId);
            })
            .then(function (onlineClients) {
                var subscriberSockets=[];
                 _.each(onlineClients,function (client) {
                    subscriberSockets.push(client.socketId);
                    if(response.io.sockets.connected[client.socketId])
                        response.io.sockets.connected[client.socketId].emit('status', {post: message});
                });
            })
            .catch(function (error) {
                console.log(error);
                helper.sendError(response, error);
            })
    },
    getActivities: function (request, response) {
        var userId;
        helper.interceptor(request, null, "body")
            .then(function (data) {
                userId = data.user._id;
                return ActivityModel.findAllActivitiesOfUser(userId)
            })
            .then(function (result) {
                helper.sendSuccess(response, result)
            })
            .catch(function (error) {
                console.log(error)
                helper.sendError(response, error);
            })
    }

};