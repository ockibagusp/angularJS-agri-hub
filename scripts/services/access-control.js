'use strict';

var authenticate = angular.module('agrihub.access-control', ['ngCookies']);

authenticate.factory('loginRequired', ['$location', 'checkCreds', 
    function($location, checkCreds) {
        return function() {
            if (!checkCreds.isAuth()) {
                $location.path('/login');
            }
        }
    }
]);

authenticate.factory('adminRequired', ['$location', 'checkCreds', 
    function($location, checkCreds) {
        return function() {
        	if (!checkCreds.isAuth()) {
                $location.path('/404');
                return false;
            } else if (!checkCreds.isAdmin()) {
                $location.path('/403');
                return false;
            }
            return true;
        }
    }
]);

authenticate.factory('researcherRequired', ['$location', 'checkCreds', 
    function($location, checkCreds) {
        return function() {
        	if (!checkCreds.isAuth()) {
                $location.path('/login');
                return false;
            } else if (!checkCreds.isResearcher()) {
                $location.path('/403');
                return false;
            }
            return true;
        }
    }
]);