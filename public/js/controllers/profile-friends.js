'use strict';

var app = angular.module('notificationSystem');

app.controller('FriendsController', function($scope, $cookies, UserService) {

    var userProfile = UserService.getUserProfile();

    var userId = $cookies.get('id');
    var userName = $cookies.get('username');

    var userData = {
      followingId: '',
      following: '',
      followerId: userId,
      follower: userName
    };

    $scope.profile = {
        username: userProfile.username,
        followers: userProfile.subscribers,
        following: userProfile.following
    };
    UserService.getPeople()
        .success(function(response) {
            $scope.people = response.message;
            angular.forEach($scope.people, function(person) {
                angular.forEach($scope.profile.followers, function(follower) {
                    if(!person.isFollowing){
                        if(person._id === follower.user)
                            person.isFollowing = true;
                        else
                            person.isFollowing = false;
                    }
                });
            });

            // angular.forEach($scope.profile.following, function(follower) {
            //     angular.forEach($scope.people, function(person) {
            //         if(person._id === follower.user)
            //             person.isFollower = true;
            //          else
            //             person.isFollower = false;
            //
            //     });
            // });


            $scope.friends = $scope.people;
        });

    $scope.subscribe = function(name, id) {
      userData.followingId = id;
      userData.following = name;
      UserService.subscriber(userData)
      .success(function(response) {
          UserService.updateUserProfile(response.message);
      });
    };

    $scope.unSubscribe = function(name, id) {
      userData.followingId = id;
      userData.following = name;
      UserService.unsubscriber(userData)
      .success(function(response) {
          UserService.updateUserProfile(response.message);
      });
    };

});