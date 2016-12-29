/**
 * Created by mir on 25/12/16.
 */
'use strict';
var path = require('path')
var UserModel = require(path.resolve('./app/models/user'));
var ConnectedClients = require(path.resolve('./app/models/connectedClients'));
var helper = require(path.resolve('./helpers/index'));
var userfunctions;
module.exports = userfunctions = {
    signup: function (request, response) {
        var newUser;
        //Helper Method for Validation in /helpers/index
        helper.validator(request, ["username", "email", "password"], "body")
            .then(function (data) {
                newUser = data;
                return UserModel.findUserByEmail(data.email, "+password +salt");
            })
            .then(function (user) {
                if (user) {
                    if (user.email == newUser.email)
                        throw helper.generateError(430);
                    if (user.mobile == newUser.mobile)
                        throw helper.generateError(431);
                }
                user = new UserModel(newUser);
                return user.save();
            })
            .then(function (user) {
                user.salt = undefined;
                user.password = undefined;
                return helper.generateToken(user)
            })
            .then(function (result) {
                helper.sendSuccess(response, result);
            })
            .catch(function (error) {
                console.log(error);
                helper.sendError(response, error);
            })
    },
    login: function (request, response) {
        var credentials;
        helper.validator(request, ["email", "password"], "body")
            .then(function (data) {
                credentials = data;
                return UserModel.findUserByEmail(data.email, "+salt +password");
            })
            .then(function (user) {
                if (!user)
                    throw helper.generateError(423);
                if (!user.authenticate(credentials.password))
                    throw helper.generateError(423);
                user.salt = undefined;
                user.password = undefined;
                return helper.generateToken(user)
            })
            .then(function (result) {
                helper.sendSuccess(response, result);
            })
            .catch(function (error) {
                console.log(error);
                helper.sendError(response, error);
            })
    },
    getAllUsers: function (request, response) {
        UserModel.findAllUsers()
            .then(function (result) {
                helper.sendSuccess(response, result);
            })
            .catch(function (error) {
                console.log(error);
                helper.sendError(response, error);
            })
    },
    getUserById: function (request, response) {
        helper.interceptor(request, [], "body")
            .then(function (data) {
                var userId = data.user._id;
                return UserModel.findUserById(userId);
            })
            .then(function (result) {
                helper.sendSuccess(response, result);
            })
            .catch(function (error) {
                console.log(error);
                helper.sendError(response, error);
            })
    }
};
