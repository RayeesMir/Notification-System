'use strict';

var app = angular.module('notificationSystem');

app.controller('LoginController', function($scope, $state,$rootScope, $window,$cookies, loginService, UserService) {
    $scope.credentials = {
      email: '',
      password: ''
    };
  $scope.login  =function() {
    if(!$scope.credentials)
       return $scope.login_error = "Empty field";
    
    if(!$scope.credentials.email)
        return $scope.login_error = "Please enter your email";
        
     if(!$scope.credentials.password)
         return $scope.login_error = "Please enter your password";
       
     
      loginService.login($scope.credentials)
          .then(function(response) {
            if(response.data.status === "success") {
              var user=response.data.message.user;
              var token=response.data.message.token;
              $rootScope.username = user.username;
              $rootScope.loggedIn = true;              
              $cookies.put('token',token);
              $cookies.put('id',user._id);
              $cookies.put('username', user.name);
              $cookies.put('followers.length', user.subscribers.length);
              // $cookies.put('following.length', user.subscribed.length);
              UserService.setUserProfile(user);
              $scope.credentials.username=undefined;
              $scope.credentials.password=undefined;
              $state.go('profile.detail');              
            } else {
              return $scope.login_error = "Invalid credentials";
            }
          });
    };
});