'use strict';

var app = angular.module('notificationSystem');

app.controller('UserController', function($scope, $state, UserService) {
   
    $scope.userData = {
      username: '',
      email: '',
      password: ''
    };
    
    $scope.errorMessage = '';

    $scope.addUser = function() {
      UserService.signup($scope.userData)
      .success(function(response) {
        if(response.status === "success") {
          alert('user created');
          $state.go('login');
        } else {
          $scope.errorMessage = response.message;
        }
      });
    };
});