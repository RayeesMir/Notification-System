'use strict';

var app = angular.module('notificationSystem');

app.controller('HomeController', function($scope, $state, $cookies,$window, UserService,loginService) {

    var user=UserService.getUserProfile();
    if(user){
      $scope.profile = {
            username: user.username,
            email: user.email            
          };
          // if(user.subscribed.length)
          //     $scope.profile.followers=user.subscribed.length;
          // else
          //     $scope.profile.followers=0;

          if(user.subscribers.length)
              $scope.profile.following=user.subscribers.length;
          else
              $scope.profile.following=0
          
        $scope.status = {
        username: $scope.profile.username,
        status: ''
      };
    }

    $scope.logout = function() {
        $cookies.put('username', '');
        $cookies.put('email', '');
        $cookies.put('followers.length', '');
        $cookies.put('following.length', '');
        $state.go('login');
    };

    $scope.update = function() {
        var post={post:$scope.post};
                console.log(post)

      UserService.updateStatus(post)
      .success(function(response) {
        console.log(response)
        if(response.status === 'success') {
          alert('status updated');
        } else {
          alert('error');
        }
      });
    };
    
});