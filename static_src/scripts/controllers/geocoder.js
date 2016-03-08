app.controller('geocoderCtrl', function($scope, $http, $timeout, _map) {
    $scope.geocodeSuccess = true;

    $scope.goTo = function($event) {
        // Only geocode when Enter is pressed
        if ($event.keyCode === 13 && $scope.goToLocation !== undefined) {
            // It is not good to expose the api key though
            var url ='https://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.goToLocation.replace(' ', '+') + '&key=AIzaSyB2qtZrmv1msXVcRuVZ44AsCxTY45vyHR0';

            $http.get(url)
            .success(function(data, status, headers, config) {
                if (data.status !== 'OK') { throw 'geocoding fails'; }

                var location = data.results[0].geometry.location;
                _map.setView(new L.LatLng(location.lat, location.lng), 9);
            })
            .error(function(data, status, headers, config) {
                $scope.geocodeSuccess = false;
                $timeout(function() { $scope.geocodeSuccess = true; }, 500);
            });
        }
    };

});
