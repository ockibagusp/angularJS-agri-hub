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
    function($scope, $routeParams, $location, Nodes, getCreds) {
        Nodes.get($routeParams.nodeId).success(function (node) {
            $scope.node = node;
            $scope.is_mine = (node.user == getCreds.user.username);
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "#/" },
                { label: "Nodes", url: "#/nodes/index"},
                { label: node.label, is_active: true}
            ];
        });

        $scope.edit = function() {
            $location.path('/nodes/edit/' + $scope.node.id);
        };
    }
);

app.controller('NodeEditCtrl',
    function($scope, $routeParams, $location, Nodes, getCreds) {
        Nodes.get($routeParams.nodeId).success(function (node) {
            $scope.node = node;
            // raise 403 when node is not owned by this auth user
            if (node.user != getCreds.user.username) {
                $location.path('/403');
            }

            $scope.unlimited = (-1 == node.subsperday);
            $scope._initial_subsperday = node.subsperday;
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
                { label: node.label, url: "#/nodes/view/" + node.id},
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