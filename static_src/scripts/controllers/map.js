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

		var	currentLayer = stateLayer.addTo(_map);

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
}]);
