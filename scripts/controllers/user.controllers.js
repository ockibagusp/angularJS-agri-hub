'use strict';

app.controller('UserListCtrl', 
	function ($scope, $location, Users, checkCreds, getCreds) {
		if (!checkCreds.isAuth()) {
        	$location.path('/login');
        	return;
    	}

    	Users.query().success(function(users) {
    		$scope.users = users;
    		// breadcrumb
            $scope.links = [
                { label: "Home", url: "#/" },
                { label: "Users", is_active: true}
            ];
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
            Users.save($scope.user).then(function() {
                $location.path('/users/index');
            });
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