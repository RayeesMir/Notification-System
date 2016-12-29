'use strict';

angular.module('notificationSystem')

.factory('loginService', ['$http', function($http,$window,$cookies) {
  
  var userAuth={};
  userAuth.login = function(credentials) {
      return $http.post('/api/users/login', credentials);
    };

 //    userAuth.getAccessToken =function() {
	// 	return localStorage.getItem('token');
	// };

	// userAuth.getUser=function() {
	// 	return localStorage.getItem('user');
	// };
	// userAuth.getUserProfile=function() {
	// 	return userProfile;
	// };

	// userAuth.setUserData= function(userData) {
	// 	if (userData) {
	// 		localStorage.setItem('token',userData.token);
	// 		localStorage.setItem('user',userData.user);
	// 	}
	// };

	// userAuth.clearToken =function() {
	// 	localStorage.removeItem('user');
	// 	localStorage.removeItem('token');
	// };

  return userAuth;
}]);
