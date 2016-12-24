'use strict';

app.controller('MainCtrl', 
    function($scope, $location, checkCreds) {
        if (!checkCreds.isAuth()) {
            $location.path('/login');
            return;
        }

        if (checkCreds.isAdmin()) {
            $location.path('/403');
        } else if (checkCreds.isResearcher()) {
            $location.path('/nodes/index');
        }
    }
);

app.controller('LoginCtrl',
    function($scope, $location, $window, Login, setCreds, checkCreds) {
        if (checkCreds.isAuth()) {
            $location.path('/nodes/index');
        }

        // default
        $scope.user = {
            'username': 'basukicahya',
            'password': 'admin123'
        };

        $scope.submit = function () {
            $scope.sub = true;

            var postData = {
                "username": $scope.user.username,
                "password": $scope.user.password
            };

            Login.login({}, postData,
                function success(response) {
                    if (undefined !== response.token) {
                        // console.log("Success:" + JSON.stringify(response));
                        setCreds(response);
                        $window.location.href = '/';
                    } else {
                        $scope.error = 'Login Failed';
                    }
                },
                function error(errorResponse) {
                    // console.log("Error:" + JSON.stringify(errorResponse));
                    $scope.error = errorResponse.data.__all__;
                }
            );
        }
    }
);

app.controller('LogoutCtrl',
    function($scope, $window, deleteCreds) {
        deleteCreds();
        $window.location.href = '/#/login';
    }
);