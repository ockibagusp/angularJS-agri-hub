'use strict';

app.controller('SensorListCtrl', 
    function($scope, $routeParams, $location, Nodes, Sensors, checkCreds, $log) {
        if (!checkCreds.isAuth()) {
            $location.path('/login');
            return;
        }

        Nodes.get($routeParams.nodeId).success(function (data) {
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "/#/" },
                { label: "Nodes", url: "/#/nodes/index"},
                { label: data.label, url: "/#/nodes/view/" + data.id},
                { label: "Sensors", is_active: true}
            ];
        });
        Sensors.query($routeParams.nodeId).success(function (data) {
            $scope.sensors = data;
            $scope.nodeid = $routeParams.nodeId;
        })
    }
);

app.controller('SensorViewCtrl',
    function($scope, $routeParams, $location, Nodes, Sensors) {
        Nodes.get($routeParams.nodeId).success(function (data) {
            $scope.nodeid = data.id;
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "/#/" },
                { label: "Nodes", url: "/#/nodes/index"},
                { label: data.label, url: "/#/nodes/view/" + data.id}
            ];
            Sensors.get($routeParams.nodeId, $routeParams.sensorId).success(function (data) {
                // breadcrumb
                $scope.links.push(
                    { label: "Sensors", url: "/#/nodes/" + $routeParams.nodeId + "/sensors/index"},
                    { label: data.label, is_active: true}
                );
                $scope.sensor = data;
            });
        });
        
        $scope.edit = function() {
            $location.path('/nodes/' + $scope.nodeid + '/sensors/edit/' + $scope.sensor.id);
        };
    }
);

app.controller('SensorNewCtrl', 
    function($scope, $routeParams, $location, Nodes, Sensors) {
        $scope.is_new = true;
        Nodes.get($routeParams.nodeId).success(function (data) {
            $scope.node = data;
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "/#/" },
                { label: "Nodes", url: "/#/nodes/index"},
                { label: data.label, url: "/#/nodes/view/" + data.id},
                { label: "Sensors", url: "/#/nodes/" + data.id + "/sensors/index"},
                { label: "New", is_active: true}
            ];
        });
        $scope.sensor = {
            label: 'TEMP'
        };
        $scope.save = function() {
            Sensors.save($scope.node, $scope.sensor).then(
                function(response) {
                    $location.path("/nodes/" + $scope.node.id + "/sensors/index");
                },
                function(error) {
                    console.log(error)
                    $scope.errors = [
                        {field: "label", message: error.data.label[0]}
                    ];
                }
            );
        };
    }
);

app.controller('SensorEditCtrl',
    function($scope, $routeParams, $location, Nodes, Sensors) {
        Nodes.get($routeParams.nodeId).success(function (data) {
            $scope.node = data;
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "/#/" },
                { label: "Nodes", url: "/#/nodes/index"},
                { label: data.label, url: "/#/nodes/view/" + data.id}
            ];
            Sensors.get($routeParams.nodeId, $routeParams.sensorId).success(function (data) {
                // breadcrumb
                $scope.links.push(
                    { label: "Sensors", url: "/#/nodes/" + $routeParams.nodeId + "/sensors/index"},
                    { label: data.label, is_active: true}
                );
                $scope.sensor = data;
            });
        });
        $scope.save = function() {
            Sensors.save($scope.node, $scope.sensor).then(function() {
                $location.path("/nodes/" + $scope.node.id + "/sensors/index");
            });
        };
    }
);