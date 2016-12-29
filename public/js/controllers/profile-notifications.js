'use strict';

var app = angular.module('notificationSystem');

app.controller('NotificationsController', function ($scope, $cookies, UserService) {
    $scope.messages=[];
    var userProfile = UserService.getUserProfile();

    $scope.following = {
        name: userProfile.subscribers
    };
    var token = $cookies.get('token');
    var socket = io.connect();
    socket.on('connect', function () {
        socket
            .emit('authenticate', {token: token})
            .on('authenticated', function () {
                //do other things
            })
            .on('unauthorized', function(msg) {
                console.log("unauthorized: " + JSON.stringify(msg.data));
                throw new Error(msg.data.type);
            })
    });
    console.log("connect fired")
    var userId = $cookies.get('id');

    UserService.getNotification()
        .success(function (response) {
            if (response.status === 'success'){
                angular.forEach(response.message,function (message) {
                    $scope.messages.push(message) ;
                });

            }
        });

    socket.on('status', function (data) {
        var post=data.post;
        console.log(post)
        // angular.forEach($scope.following.name, function (foll) {
        //     if (foll.username === data.username) {
                $scope.$apply(function () {
                    $scope.messages.push(post);
                });
        //     }
        // });
    });


});