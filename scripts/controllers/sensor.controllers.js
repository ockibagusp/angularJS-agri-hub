'use strict';

app.controller('SensorListCtrl', 
    function($scope, $routeParams, $location, Nodes, Sensors, researcherRequired, getCreds) {
        if(!researcherRequired()) {
            return;
        }

        Nodes.get($routeParams.nodeId).success(function (node) {
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "#/" },
                { label: "Nodes", url: "#/nodes/index"},
                { label: node.label, url: "#/nodes/view/" + node.id},
                { label: "Sensors", is_active: true}
            ];
            $scope.is_mine = (node.user == getCreds.user.username);
        });
        Sensors.query($routeParams.nodeId).success(function (data) {
            $scope.sensors = data;
            $scope.nodeid = $routeParams.nodeId;
        })
    }
);

app.controller('SensorViewCtrl',
    function($scope, $routeParams, $location, Nodes, Sensors, researcherRequired, getCreds) {
        if(!researcherRequired()) {
            return;
        }

        Nodes.get($routeParams.nodeId).success(function (node) {
            $scope.nodeid = node.id;
            $scope.is_mine = (node.user == getCreds.user.username);
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "#/" },
                { label: "Nodes", url: "#/nodes/index"},
                { label: node.label, url: "#/nodes/view/" + node.id}
            ];
            Sensors.get($routeParams.nodeId, $routeParams.sensorId).success(function (node) {
                // breadcrumb
                $scope.links.push(
                    { label: "Sensors", url: "#/nodes/" + $routeParams.nodeId + "/sensors/index"},
                    { label: node.label, is_active: true}
                );
                $scope.sensor = node;
            });
        });
        
        $scope.edit = function() {
            $location.path('/nodes/' + $scope.nodeid + '/sensors/edit/' + $scope.sensor.id);
        };
    }
);

app.controller('SensorNewCtrl', 
    function($scope, $routeParams, $location, Nodes, Sensors, researcherRequired, getCreds) {
        if(!researcherRequired()) {
            return;
        }

        $scope.is_new = true;
        Nodes.get($routeParams.nodeId).success(function (node) {
            $scope.node = node;
            // raise 403 when node is not owned by this auth user
            if (node.user != getCreds.user.username) {
                $location.path('/403');
            }
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "#/" },
                { label: "Nodes", url: "#/nodes/index"},
                { label: node.label, url: "#/nodes/view/" + node.id},
                { label: "Sensors", url: "#/nodes/" + node.id + "/sensors/index"},
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
                function(errors) {
                    $scope.errors = extractErrors(errors.data);
                }
            );
        };
    }
);

app.controller('SensorEditCtrl',
    function($scope, $routeParams, $location, Nodes, Sensors, researcherRequired, getCreds) {
        if(!researcherRequired()) {
            return;
        }
        
        Nodes.get($routeParams.nodeId).success(function (node) {
            $scope.node = node;
            // raise 403 when node is not owned by this auth user
            if (node.user != getCreds.user.username) {
                $location.path('/403');
            }
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "#/" },
                { label: "Nodes", url: "#/nodes/index"},
                { label: node.label, url: "#/nodes/view/" + node.id}
            ];
            Sensors.get($routeParams.nodeId, $routeParams.sensorId).success(function (node) {
                // breadcrumb
                $scope.links.push(
                    { label: "Sensors", url: "#/nodes/" + $routeParams.nodeId + "/sensors/index"},
                    { label: node.label, is_active: true}
                );
                $scope.sensor = node;
            });
        });
        $scope.save = function() {
            Sensors.save($scope.node, $scope.sensor).then(
                function() {
                    $location.path("/nodes/" + $scope.node.id + "/sensors/index");
                },
                function(errors) {
                    $scope.errors = extractErrors(errors.data);
                }
            );
        };
    }
);

function extractErrors(errorsParse) {
    var errors = [];
    for(let index in errorsParse) {
        console.log(index)
        if(errorsParse.hasOwnProperty(index)) {
            errors.push({
                field: index,
                message: typeof errorsParse[index] === 'string' ? 
                    errorsParse[index]: errorsParse[index][0]
            })
        }
    }
    return errors;
}