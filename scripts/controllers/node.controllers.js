'use strict';

app.controller('NodeListCtrl', 
    function($scope, $location, Nodes, checkCreds) {
        if (!checkCreds.isAuth()) {
            $location.path('/login');
            return;
        }

        // breadcrumb
        $scope.links = [
            { label: "Home", url: "#/" },
            { label: "Nodes", is_active: true}
        ];

        Nodes.query("all").success(function (data) {
            $scope.nodes = data;
            $scope.tabChange = function(role) {
                Nodes.query(role).success(function (data) {
                    $scope.nodes = data;
                });
            }
        })
    }
);

app.controller('NodeViewCtrl',
    function($scope, $routeParams, $location, Nodes) {
        Nodes.get($routeParams.nodeId).success(function (data) {
            $scope.node = data;
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "#/" },
                { label: "Nodes", url: "#/nodes/index"},
                { label: data.label, is_active: true}
            ];
        });

        $scope.edit = function() {
            $location.path('/nodes/edit/' + $scope.node.id);
        };
    }
);

app.controller('NodeEditCtrl',
    function($scope, $routeParams, $location, Nodes) {
        Nodes.get($routeParams.nodeId).success(function (data) {
            $scope.node = data;
            $scope.unlimited = (-1 == data.subsperday);
            $scope._initial_subsperday = data.subsperday;
            $scope.node.is_public = $scope.node.is_public ? true : false;
            $scope.limitchange = function() {
                if ($scope.unlimited) {
                    $scope.node.subsperday = -1;
                } else {
                    $scope.node.subsperday = (-1 == $scope._initial_subsperday) ? 0 : 
                        $scope._initial_subsperday;
                }
            };
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "#/" },
                { label: "Nodes", url: "#/nodes/index"},
                { label: data.label, url: "#/nodes/view/" + data.id},
                { label: "Edit", is_active: true}
            ];
        });
        $scope.save = function() {
            $scope.node.is_public = $scope.node.is_public ? 1 : 0;
            Nodes.save($scope.node).then(function() {
                $location.path('/nodes/index');
            });
        };
    }
);

app.controller('NodeNewCtrl',
    function($scope, $location, Nodes) {
        $scope.is_new = true;
        $scope.node = {
            'label': "FILKOM_1",
            'secretkey': 'rahasia',
            'subsperday': 20
        };
        $scope.limitchange = function() {
            if ($scope.unlimited) {
                $scope.node.subsperday = -1;
            } else {
                $scope.node.subsperday = 0;
            }
        };
        // breadcrumb
        $scope.links = [
            { label: "Home", url: "#/" },
            { label: "Nodes", url: "#/nodes/index"},
            { label: "New", is_active: true}
        ];
        $scope.save = function() {
            $scope.node.is_public = $scope.node.is_public ? 1 : 0;
            Nodes.save($scope.node).then(
                function(response) {
                    $location.path('/nodes/index');
                },
                function(error) {
                    var errors = [];
                    angular.forEach(error.data, function(value, key) {
                        this.push({
                            field: key,
                            message: value[0]
                        });
                    }, errors);
                    $scope.errors = errors;
                }
            );
        };
    }
);