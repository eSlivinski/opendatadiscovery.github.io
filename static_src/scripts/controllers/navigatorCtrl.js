app.controller('navigatorCtrl', function($scope, mapService) {
    $scope.loadStateMap = function() {
        mapService.loadStateMap();
    };

    $scope.loadCountyMap = function() {
        mapService.loadCountyMap();
    };
});
