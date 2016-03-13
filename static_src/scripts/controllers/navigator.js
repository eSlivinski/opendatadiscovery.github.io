app.controller('navigatorCtrl', function($scope, $http, _map, mapService) {

  var switchTo = {
    State: mapService.loadStateMap,
    County: mapService.loadCountyMap
  };

  $scope.currentResolution = 'State';

  $scope.resolutions = ['State', 'County'];

  $scope.changeResolution = function(resolution) {
    if ($scope.currentResolution === resolution) { return; }
    $scope.currentResolution = resolution;
    switchTo[resolution]();
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
