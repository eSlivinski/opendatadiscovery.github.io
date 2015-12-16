/*
* @Author: haoliang
* @Date:   2015-08-08 21:43:57
* @Last Modified by:   haoliang
* @Last Modified time: 2015-08-28 08:54:22
*/

app.controller("mapCtrl", ["$scope", '$http', 'mapStyle', '_map',
	function($scope, $http, _map, mapStyle) {

	var stateLayer = new L.GeoJSON.AJAX('data/datagov.state.json', {
		style : mapStyle.getStateSymbolStyle,
		onEachFeature: mapStyle.onEachFeature
	});

	var countyLayer = new L.GeoJSON.AJAX('data/datagov.county.json', {
		style : mapStyle.getCountySymbolStyle,
		onEachFeature: mapStyle.onEachFeature
	});

	var	currentLayer = stateLayer;
	currentLayer.addTo(_map);

    $scope.loadLayer = function(level) {
        leafletData.getMap('map').then(function(map) {
            map.removeLayer(currentLayer);

            if (level == 'state') {
                currentLayer = stateLayer;
            }
            else {
                currentLayer = countyLayer;
            }

            currentLayer.addTo(map);
        });
    };

    $scope.selectedLevel = 'state';

    $scope.zoomBack = function() {
        leafletData.getMap('map').then(function(map) {
            map.setView(new L.LatLng(38.484656, -96.862625), 4);
        });
    };

    $scope.geocodeSuccess = true;

    $scope.goTo = function($event) {
        // Only geocode when Enter is pressed
        if ($event.keyCode === 13 && $scope.goToLocation !== undefined) {
            // It is not good to expose the api key though
            var url ='https://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.goToLocation.replace(' ', '+') +'&key=AIzaSyB2qtZrmv1msXVcRuVZ44AsCxTY45vyHR0';
            $http.get(url)
            .success(function(data, status, headers, config) {
                if (data.status === 'OK') {
                    leafletData.getMap('map').then(function(map) {
                        var location = data.results[0].geometry.location;
                        map.setView(new L.LatLng(location.lat, location.lng), 9);
                    });
                }
                else {
                    $scope.geocodeSuccess = false;
                    setTimeout(function() { $scope.geocodeSuccess = true; }, 500);
                    $scope.$apply();
                }
            })
            .error(function(data, status, headers, config) {
                $scope.geocodeSuccess = false;
                setTimeout(function() { $scope.geocodeSuccess = true; }, 500);
                $scope.$apply();
            });
        }
    };
}]);
