'use strict';

var authenticate = angular.module('agrihub.authenticate', ['ngCookies']);

authenticate.factory('setCreds', ['$cookies', function($cookies) {
	return function(credentials) {
		$cookies.put('user', JSON.stringify(credentials.user));
		$cookies.put('token', credentials.token);
	};
}]);

authenticate.factory('checkCreds', ['$cookies', function($cookies) {
    var getUser = function () {
        return JSON.parse($cookies.get('user'));
    };
    var isAuth = function() {
        var user = $cookies.get('user');
        var token = $cookies.get('token');
        return !!((undefined !== user && "" !== user) && undefined !== token && "" !== token);
	};

    return {
    	'isAuth': function() {
    		return isAuth();
    	},
    	'isAdmin': function() {
    		if (!isAuth()) {
    			return false;
            }
    		return 1 == getUser().is_admin;

    	},
        'isResearcher': function() {
            if (!isAuth()) {
                return false;
            }
            return 0 == getUser().is_admin;

        }
    };
}]);

// user must be validated with checkCreds before calling this service
authenticate.factory('getCreds', ['$cookies', function($cookies) {
    var user = $cookies.get('user') || '{}';
    return {
        'token': $cookies.get('token'),
        'user': JSON.parse(user)
    };
}]);

authenticate.factory('deleteCreds', ['$cookies', function($cookies) {
    return function() {
        $cookies.remove('token');
        $cookies.remove('user');
    };
}]);