'use strict';

app.controller('NodeListCtrl', 
    function($scope, $location, Nodes, checkCreds) {
        if (!checkCreds.isAuth()) {
            $location.path('/login');
            return;
        }

        // breadcrumb
        $scope.links = [
            { label: "Home", url: "/#/" , is_active: true}
        ];

        Nodes.query().success(function (data) {
            $scope.nodes = data
        })
    }
);

app.controller('NodeViewCtrl',
    function($scope, $routeParams, $location, Nodes) {
        Nodes.get($routeParams.nodeId).success(function (data) {
            $scope.node = data;
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "/#/" },
                { label: "Nodes", url: "/#/"},
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
                { label: "Home", url: "/#/" },
                { label: "Nodes", url: "/#/"},
                { label: data.label, url: "/#/nodes/view/" + data.id},
                { label: "Edit", is_active: true}
            ];
        });
        $scope.save = function() {
            Nodes.save($scope.node).then(function() {
                $location.path('/nodes/index');
            });
        };
    }
);

app.controller('NodeNewCtrl',
    function($scope, $location, Nodes, getCreds) {
        $scope.is_new = true;
        $scope.node = {
            'user': getCreds.user.username,
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
            { label: "Home", url: "/#/" },
            { label: "Nodes", url: "/#/"},
            { label: "New", is_active: true}
        ];
        $scope.save = function() {
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