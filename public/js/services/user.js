'use strict';

var app = angular.module('notificationSystem');

app.factory('UserService', ['$http', function($http) {
  var UserProfile = {};

  return {
    getPeople: function() {
      return $http.get('/api/users');
    },

    signup: function(data) {
      return $http.post('/api/users', data);
    },

    getUser: function(id) {
      return $http.get('/api/users/' + id);
    },

    subscriber: function(user) {
      return $http.post('/api/users/subscribe', user);
    },

    unsubscriber: function(user) {
      return $http.post('/api/users/unsubscribe', user);
    },

    updateStatus: function(data) {
      return $http.post('/api/activity', data);
    },

    getNotification: function() {
      return $http.get('/api/activity');
    },

    getUserProfile: function() {
      return UserProfile;
    },

    setUserProfile: function(user) {
      UserProfile = user;
    },
    
    updateUserProfile: function(following) {
      if(following.user)
          UserProfile.subscribers.push(following.user)  ;
        console.log("userProfile",UserProfile)
    }
  };
}]);