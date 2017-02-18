'use strict';

app.controller('UserListCtrl', 
	function ($scope, $location, Users, checkCreds, getCreds) {
		if (!checkCreds.isAuth()) {
        	$location.path('/login');
        	return;
    	}

        // breadcrumb
        $scope.links = [
            { label: "Home", url: "#/" },
            { label: "Users", is_active: true}
        ];

        $scope.active = $location.search().type || 'admin';
        $location.search('type', $scope.active);

    	Users.query($scope.active).success(function(users) {
    		$scope.users = users;
            $scope.tabChange = function(type) {
                $location.search('type', type);
                Users.query(type).success(function (users) {
                    $scope.users = users;
                });
            }
    	});
	}
);

app.controller('UserViewCtrl',
    function($scope, $routeParams, $location, Users, getCreds) {
        Users.get($routeParams.userId).success(function (user) {
            $scope.user = user;
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "#/" },
                { label: "Users", url: "#/users/index"},
                { label: user.username, is_active: true}
            ];
        });

        $scope.edit = function() {
            $location.path('/users/edit/' + $scope.user.id);
        };
    }
);

app.controller('UserEditCtrl',
    function($scope, $routeParams, $location, Users) {
        Users.get($routeParams.userId).success(function (user) {
            $scope.user = user;
            $scope.user.is_admin = $scope.user.is_admin ? true : false;
            // breadcrumb
            $scope.links = [
                { label: "Home", url: "#/" },
                { label: "Users", url: "#/users/index"},
                { label: user.username, url: "#/users/view/" + user.id},
                { label: "Edit", is_active: true}
            ];
        });
        $scope.save = function() {
            $scope.user.is_admin = $scope.user.is_admin ? 1 : 0;
            Users.save($scope.user).then(
                function() {
                    $location.path('/users/index');
                },
                function(errors) {
                    $scope.errors = extractErrors(errors.data);
                }
            );
        };
    }
);

app.controller('UserNewCtrl',
    function($scope, $location, Users) {
        $scope.is_new = true;
        $scope.user = {
            'username': "milea",
            'email': "milea@example.com",
            'first_name': "Milea Adnan",
            'last_name': "Nasution",
            'is_admin': 0
        };
        // breadcrumb
        $scope.links = [
            { label: "Home", url: "#/" },
            { label: "Users", url: "#/users/index"},
            { label: "New", is_active: true}
        ];
        $scope.save = function() {
            $scope.user.is_public = $scope.user.is_public ? 1 : 0;
            Users.save($scope.user).then(
                function(response) {
                    $location.path('/users/index');
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