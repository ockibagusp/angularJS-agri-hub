'use strict';

app.controller('MainCtrl', 
    function($scope, $location, checkCreds) {
        if (!checkCreds.isAuth()) {
            $location.path('/login');
            return;
        }

        if (checkCreds.isAdmin()) {
            $location.path('/users/index');
        } else if (checkCreds.isResearcher()) {
            $location.path('/nodes/index');
        }
    }
);

app.controller('LoginCtrl',
    function($scope, $location, $window, Login, setCreds, checkCreds) {
        if (checkCreds.isAuth()) {
            $location.path('/');
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
                        $window.location.href = '';
                    } else {
                        $scope.error = 'Login Failed';
                    }
                },
                function error(errorResponse) {
                    $scope.error = errorResponse.data.__all__;
                }
            );
        }
    }
);

app.controller('RegisterCtrl',
    function($scope, $location, Register, checkCreds) {
        if (checkCreds.isAuth()) {
            $location.path('/');
        }

        // default
        $scope.user = {
            'username': 'milea',
            'password': '',
            'email': 'milea@example.com',
            'first_name': 'Milea Adnan',
            'last_name': 'Nasution'
        };

        $scope.submit = function () {

            Register.register({}, $scope.user,
                function success(response) {
                    $location.path('/login');
                },
                function error(errorResponse) {
                    $scope.errors = extractErrors(errorResponse.data);
                }
            );
        }
    }
);

app.controller('LogoutCtrl',
    function($scope, $location, deleteCreds) {
        deleteCreds();
        $location.path('/login');
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