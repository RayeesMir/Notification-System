'use strict';

var app = angular.module('notificationSystem');

app.controller('profileController', function($scope, $cookies,$state,UserService) {

    $scope.logout = function() {
        $cookies.put('username', '');
        $cookies.put('email', '');
        $cookies.put('followers.length', '');
        $cookies.put('following.length', '');
        $state.go('login');
    };

    $scope.update = function() {
      var post={post:$scope.post};
      console.log(post);
      UserService.updateStatus(post)
      .success(function(response) {
      	console.log(response);	
        if(response.status === 'success') {
          alert('status updated');
        } else {
          alert('error');
        }
      });
    };

});