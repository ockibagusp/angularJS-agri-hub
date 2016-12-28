'use strict';

app.controller('SubscriptionsListUserCtrl', 
    function($scope, $location, Subscriptions, checkCreds) {
        if (!checkCreds.isAuth()) {
            $location.path('/login');
            return;
        }

        Subscriptions.filterbyuser().success(function (data) {
            $scope.subscriptions = data;
            // pagination
            $scope.maxSize = 5;
            $scope.currentPage = 1;
            $scope.totalItems = data.count;
            $scope.pageChanged = function() {
                Subscriptions.filterbyuser($scope.currentPage).success(function (data) {
                    $scope.subscriptions = data;
                })
            };
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "#/" },
                { label: "All Subscriptions", is_active: true}
            ];
        });
    }
);

app.controller('SubscriptionsListNodeCtrl', 
    function($scope, $routeParams, $location, Subscriptions, Nodes, checkCreds) {
        if (!checkCreds.isAuth()) {
            $location.path('/login');
            return;
        }

        Subscriptions.filterbynode($routeParams.node).success(function (data) {
            $scope.subscriptions = data;
            // pagination
            $scope.maxSize = 5;
            $scope.currentPage = 1;
            $scope.totalItems = data.count;
            $scope.pageChanged = function() {
                Subscriptions.filterbynode($routeParams.node, $scope.currentPage).success(function (data) {
                    $scope.subscriptions = data;
                })
            };
            Nodes.get($routeParams.node).success(function (data) {
                $scope.node = data.label;
                // breadcrumb
                $scope.links = [
                    { label: "Home", url: "#/" },
                    { label: "Nodes", url: "#/"},
                    { label: data.label, url: "#/nodes/view/" + data.id },
                    { label: "Subscriptions", is_active: true}
                ];
            });
        })
    }
);

app.controller('SubscriptionsListNodeSensorCtrl',
    function($scope, $routeParams, $location, Subscriptions, Nodes, Sensors, checkCreds) {
        if (!checkCreds.isAuth()) {
            $location.path('/login');
        }

        Nodes.get($routeParams.node).success(function (data) {
            $scope._node = data;
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "#/" },
                { label: "Nodes", url: "#/"},
                { label: data.label, url: "#/nodes/view/" + data.id },
                { label: "Sensors", url: "#/nodes/" + data.id + "/sensors/index" },
            ];
            Sensors.get($routeParams.node, $routeParams.sensor).success(function(data) {
                $scope.node = $scope._node.label + " (" + data.label + ")";
                $scope.links.push(
                    { label: data.label, url: "#/nodes/" + $scope._node.id + 
                        "/sensors/view/" + data.id
                    },
                    { label: "Subscriptions", is_active: true}
                );
            });
        });

        Subscriptions.filterbynodesensor($routeParams.node, $routeParams.sensor).success(function (data) {
            $scope.subscriptions = data;
            // pagination
            $scope.maxSize = 5;
            $scope.totalItems = data.count;
            $scope.pageChanged = function() {
                Subscriptions.filterbynodesensor($routeParams.node, $routeParams.sensor, 
                    $scope.currentPage).success(function (data) {
                        $scope.subscriptions = data;
                })
            };
        });
    }
);