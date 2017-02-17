'use strict';

var app = angular.module('agrihub',
    ['ngRoute', 'ui.bootstrap', 'agrihub.directives', 'agrihub.services', 'agrihub.authenticate']
);

app.config(function($resourceProvider) {
  $resourceProvider.defaults.stripTrailingSlashes = false;
});

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/', {
        controller: 'MainCtrl',
        template: ' '
    }).when('/login', {
        controller: 'LoginCtrl',
        templateUrl: 'views/loginForm.html'
    }).when('/logout', {
        controller: 'LogoutCtrl',
        template: ' '
    })
    // users
    .when('/users/index', {
        controller: 'UserListCtrl',
        templateUrl: 'views/users/user-list.html'
    })
    .when('/users/edit/:userId', {
        controller: 'UserEditCtrl',
        templateUrl: 'views/users/user-form.html'
    })
    .when('/users/view/:userId', {
        controller: 'UserViewCtrl',
        templateUrl: 'views/users/user-view.html'
    })
    .when('/users/new', {
        controller: 'UserNewCtrl',
        templateUrl: 'views/users/user-form.html'
    })
    // Nodes
    .when('/nodes/index', {
        controller: 'NodeListCtrl',
        templateUrl: 'views/nodes/node-list.html'
    })
    .when('/nodes/edit/:nodeId', {
        controller: 'NodeEditCtrl',
        templateUrl: 'views/nodes/node-form.html'
    })
    .when('/nodes/view/:nodeId', {
        controller: 'NodeViewCtrl',
        templateUrl: 'views/nodes/node-view.html'
    })
    .when('/nodes/new', {
        controller: 'NodeNewCtrl',
        templateUrl: 'views/nodes/node-form.html'
    })

    // Sensors
    .when('/nodes/:nodeId/sensors/index', {
        controller: 'SensorListCtrl',
        templateUrl: 'views/sensors/sensor-list.html'
    })
    .when('/nodes/:nodeId/sensors/view/:sensorId', {
        controller: 'SensorViewCtrl',
        templateUrl: 'views/sensors/sensor-view.html'
    })
    .when('/nodes/:nodeId/sensors/new', {
        controller: 'SensorNewCtrl',
        templateUrl: 'views/sensors/sensor-form.html'
    })
    .when('/nodes/:nodeId/sensors/edit/:sensorId', {
        controller: 'SensorEditCtrl',
        templateUrl: 'views/sensors/sensor-form.html'
    })

    // Subscriptions
    .when('/subscriptions/index', {
        controller: 'SubscriptionsListUserCtrl',
        templateUrl: 'views/subscriptions/subscription-list.html'
    })
    .when('/subscriptions/node/:node/index', {
        controller: 'SubscriptionsListNodeCtrl',
        templateUrl: 'views/subscriptions/subscription-list.html'
    })
    .when('/subscriptions/node/:node/sensor/:sensor/index', {
        controller: 'SubscriptionsListNodeSensorCtrl',
        templateUrl: 'views/subscriptions/subscription-list.html'
    })
    // HTTP exceptions
    .when('/403', {
        templateUrl: 'views/exceptions/exception.html'
    })
    .when('/404', {
        templateUrl: 'views/exceptions/exception.html'
    })
    .otherwise({redirectTo: '/404'});
}]);