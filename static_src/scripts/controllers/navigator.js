app.controller('navigatorCtrl', function($scope, $http, $uibModal, _map, mapService) {

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

  $scope.openAboutModal = function() {
    var aboutModal = $uibModal.open({
      animation: true,
      controller: 'aboutModalCtrl',
      templateUrl: 'static/views/about.html'
    });
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

      var viewPort = data.results[0].geometry.viewport;

      var southWest = L.latLng(viewPort.southwest.lat, viewPort.southwest.lng);
      var northEast = L.latLng(viewPort.northeast.lat, viewPort.northeast.lng);
      var viewBounds = L.latLngBounds(southWest, northEast);

      _map.fitBounds(viewBounds);
    })
    .error(function(err) {

      console.error(err);
      $scope.showGeocodingMessage = true;
      $timeout(function() { $scope.showGeocodingMessage = false; }, 1500);
    });
  }
});
