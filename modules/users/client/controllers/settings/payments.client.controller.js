'use strict';

angular.module('users').controller('PaymentsController', ['$scope', '$timeout', '$window', 'Authentication', '$http',
    function ($scope, $timeout, $window, Authentication, $http) {
        // Change user profile picture
        $scope.initiatePayment = function () {
            $http.post('/api/users/initiatePayment').success(function(response) {
                $window.location.href = response.redirect;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);
