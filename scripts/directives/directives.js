var directives = angular.module('agrihub.directives', []);
directives.directive('butterbar', ['$rootScope',
    function ($rootScope) {
        return {
            link: function (scope, element, attrs) {
                element.addClass('hide');
                $rootScope.$on('$routeChangeStart', function () {
                    element.removeClass('hide');
                });
                $rootScope.$on('$routeChangeSuccess', function () {
                    element.addClass('hide');
                });
            }
        };
    }]
);

directives.directive('navBar', function (getCreds) {
    return {
        restrict: 'A',
        templateUrl: 'views/navbar.html',
        link: function (scope, element, attrs) {
            scope.username = getCreds.user.username
        }
    };
});

directives.directive('breadcrumb', function (getCreds) {
    return {
        restrict: 'A',
        scope: {links: '='},
        templateUrl: 'views/breadcrumb.html',
        link: function (scope, element, attrs) {
            scope.title = attrs.title;
            scope.username = getCreds.user.username,
            scope.role = getCreds.user.is_admin
        }
    };
});

directives.directive('focus', function () {
    return {
        link: function (scope, element, attrs) {
            element[0].focus();
        }
    };
});

directives.directive('confirmModal', ['$uibModal', 'Sensors', function ($uibModal, Sensors) {
    return {
        restrict: 'A',
        scope: {
            'action': '&nConfirmModal',
            'text': '@rel',
            'url': '=',
            'redirecturl': '@',
            'object': '@',
            'objectlabel': '='
        },
        link: function (scope, element, attrs) {
            element.on('click', function () {
                var modalInstance = $uibModal.open({
                    templateUrl: 'views/modal.html',
                    controller: ['$scope', '$uibModalInstance', '$location', 'text', 'url', 'redirecturl',
                        'object', 'objectlabel', 
                        function ($scope, $uibModalInstance, $location, text, url, redirecturl,
                        object, objectlabel) {
                            $scope.text = text;
                            $scope.object = object;
                            $scope.objectlabel = objectlabel;
                            var redirect = redirecturl || '/';
                            $scope.ok = function () {
                                $uibModalInstance.close(/*$scope.text*/);
                                Sensors.delete(url);
                                $location.path(redirect);
                            };
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss('cancel');
                            };
                        }
                    ],
                    resolve: {
                        text: function () {
                            return scope.text;
                        },
                        url: function() {
                            return scope.url;
                        },
                        redirecturl: function() {
                            return scope.redirecturl;
                        },
                        object: function () {
                            return scope.object;
                        },
                        objectlabel: function () {
                            return scope.objectlabel;
                        }
                    }
                });
                modalInstance.result.then(function (/*text*/) {
                    scope.action();
                }, function () {
                });
            });
        }
    };
}]);