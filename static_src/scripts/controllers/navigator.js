app.controller('navigatorCtrl', function($scope, $http, _map, mapService) {
    $scope.loadStateMap = function() {
        mapService.loadStateMap();
    };

    $scope.loadCountyMap = function() {
        mapService.loadCountyMap();
    };

    $scope.goTo = function($event) {
        // Only geocode when Enter is pressed
        if ($event && $event.keyCode === 13 && $scope.location) {
            geocode($scope.location);
        }

        if (!$event && $scope.location) {
            geocode($scope.location);
        }
    };
    $scope.showGeocodingMessage = true;
    function geocode(location) {
        var url ='https://maps.googleapis.com/maps/api/geocode/json?address=' + location.replace(' ', '+') + '&key=AIzaSyB2qtZrmv1msXVcRuVZ44AsCxTY45vyHR0';

        $http.get(url)
        .success(function(data) {
            if (data.status !== 'OK') { throw 'geocoding fails'; }

            var result = data.results[0].geometry.location;
            _map.panTo(new L.LatLng(result.lat, result.lng));
        })
        .error(function(err) {
            console.error(err);
            $scope.showGeocodingMessage = true;
            $timeout(function() { $scope.showGeocodingMessage = false; }, 1500);
        });
    }
});
