'use strict';

angular.module('users').controller('PaymentsController', ['$scope', '$timeout', '$window', 'Authentication', '$http',
    function ($scope, $timeout, $window, Authentication, $http) {
        // Change user profile picture
        $scope.initiatePayment = function () {
            console.log('starting payment');
            $http.post('/api/users/payment').success(function(response) {
                // If successful show success message and clear form
                $scope.success = true;
            }).error(function(response) {
                $scope.error = response.message;
            });
        };
    }
]);
