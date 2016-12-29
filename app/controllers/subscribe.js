/**
 * Created by mir on 25/12/16.
 */
var path = require('path');
var UserModel = require(path.resolve('./app/models/user'));
var helper = require(path.resolve('./helpers/index'));
var _ = require('lodash');

function Subscriber() {
}

Subscriber.prototype = {

    subscribe: function (following, subscription) {
        return new Promise(function (resolve, reject) {
            UserModel.findUserById(following)
                .then(function (user) {
                    user.subscribers.push(subscription);
                    return user.save();
                })
                .then(function (user) {
                    var subscribers = user.subscribers;
                    var subscriber = _.find(subscribers, function (follower) {
                        return follower == subscription.user
                    });
                    resolve(subscriber);
                })
                .catch(function (error) {
                    reject(error);
                })
        })
    },

    // updateSubcription:function(user,subscription){
    // 	return new Promise(function(resolve,reject){
    // 		console.log(user, subscription.user,subscription.fields)
    // 		 UserModel.updateSubcription(user, subscription.user,subscription.fields)
    // 		 	.then(function(user){
    // 		 		resolve(user);
    // 		 	})
    // 		 	.catch(function(error){
    // 			 	reject(error);
    // 		 	})
    // 	})
    // },

    subscribeToUser: function (following, subscription) {
        var self = this;
        return new Promise(function (resolve, reject) {
            UserModel.checkUserSubscription(following, subscription.user)
                .then(function (result) {
                    if (result)
                        throw helper.generateError(420);
                    else
                        return self.subscribe(following, subscription);
                })
                .then(function (user) {
                    resolve(user);
                })
                .catch(function (error) {
                    reject(error);
                })
        })
    },

    unSubscribeToUser: function (user, subscriber) {
        return new Promise(function (resolve, reject) {
            UserModel.update({_id: user}, {$pull: {"subscribers": {"user": subscriber}}})
                .then(function (user) {
                    resolve(user);
                })
                .catch(function (error) {
                    reject(error);
                })
        })
    }

};

var Subscription = new Subscriber();

module.exports = {

    subscribe: function (request, response) {
        helper.interceptor(request, ["followingId"], "body")
            .then(function (data) {
                var following = data.input.followingId;
                var user=data.user._id;
                var subscription = {
                    user: user
                    // ,
                    // fields:data.input.fields
                };
                // console.log(subscription)
                return Subscription.subscribeToUser(following, subscription);
            })
            .then(function (result) {
                helper.sendSuccess(response, result)
            })
            .catch(function (error) {
                console.log(error);
                helper.sendError(response, error);
            })
    },

    unSubscribe: function (request, response) {
        var subscriber;
        helper.interceptor(request, ["user"], "body")
            .then(function (data) {
                subscriber = data.input.user;
                return Subscription.unSubscribeToUser(subscriber, data.user._id);
            })
            .then(function (result) {
                helper.sendSuccess(response, result)
            })
            .catch(function (error) {
                console.log(error);
                helper.sendError(response, error);
            })
    }
};