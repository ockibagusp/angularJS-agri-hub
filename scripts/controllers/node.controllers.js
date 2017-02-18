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

        $scope.active = $location.search().visibility || 'all';
        $location.search('visibility', $scope.active);

        Nodes.query($scope.active).success(function (data) {
            $scope.nodes = data;
            $scope.tabChange = function(role) {
                $location.search('visibility', role);
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
            Nodes.save($scope.node).then(
                function(response) {
                    $location.path('/nodes/index');
                },
                function(errors) {
                    $scope.errors = extractErrors(errors.data);
                }
            );
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