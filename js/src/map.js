/* 
* @Author: haoliang
* @Date:   2015-08-08 21:43:57
* @Last Modified by:   haoliang
* @Last Modified time: 2015-08-28 08:54:22
*/  

'use strict'

app.controller("mapController", ["$scope", '$http', 'leafletData', 
	function($scope, $http, leafletData) {

    var stateLayer, countyLayer, currentLayer;     

    $scope.dataSource = 'Data.gov';

    $http.get('data/legend.json')
         .then(function(response) {
            $scope.legendStyle = {'state' : response.data['state'],
                                  'county' : response.data['county']};
         });

    // Configuration the map
    angular.extend($scope, {
    	mapDefaults: {
            tileLayer: 'https://api.tiles.mapbox.com/v4/dz316424.no2ad5mo/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiZHozMTY0MjQiLCJhIjoiNzI3NmNkOTcyNWFlNGQxNzU2OTA1N2EzN2FkNWIwMTcifQ.NS8KWg47FzfLPlKY0JMNiQ',
	        zoomControlPosition: 'topright'
    	}
    });

    // Manipulate the Leaflet control directly
    leafletData.getMap('map').then(function(map) {
        map.setView(new L.LatLng(38.484656, -96.862625), 4);
        map.options.maxZoom = 15;
        map.options.minZoom = 2;
        map.options.worldCopyJump = true;

        var getLegendColor = function (dataNum, legend) {
            var lowerLimit, upperLimit;
            for (var i = 0; i < legend.length; i++) {
                lowerLimit = legend[i].limit[0];
                upperLimit = legend[i].limit[1];
                if (lowerLimit <= dataNum && dataNum < upperLimit) {
                    return legend[i].color;
                }
            }

            return legend[legend.length - 1].color;
        };

    	var getStyleState = function(feature, level) {
		    return {
		        fillColor: getLegendColor(feature.properties.data_num, $scope.legendStyle['state']),
		        weight: 0.3,
		        opacity: 1,
		        color: 'grey',
		        dashArray: '',
		        fillOpacity: 0.5
		    };
		};

        var getStyleCounty = function(feature) {
            return {
                fillColor: getLegendColor(feature.properties.data_num, $scope.legendStyle['county']),
                weight: 0.3,
                opacity: 1,
                color: 'grey',
                dashArray: '',
                fillOpacity: 0.5
            };
        };

		var highlightFeature = function(e) {
		    var layer = e.target;

		    layer.setStyle({
		        weight: 2,
		        color: 'white',
		        dashArray: ''
		    });

		    // Show the number of data at state
		    $scope.showLegend = true;
		    $scope.dataNum = layer.feature.properties.data_num;

            if ($scope.selectedLevel == 'state') {
                $scope.placeName = layer.feature.properties.state;
            }
		    else {
                $scope.placeName = layer.feature.properties.county + ', ' + layer.feature.properties.state;
            }

		    if (!L.Browser.ie && !L.Browser.opera) {
		        layer.bringToFront();
		    }
		};

		var resetHighlight = function(e) {
			$scope.showLegend = false;
		    currentLayer.resetStyle(e.target);
		};

		var onEachFeature = function(feature, layer) {
		    layer.on({
		        mouseover: highlightFeature,
		        mouseout: resetHighlight,
		    });
		};
        
    	stateLayer = new L.GeoJSON.AJAX('data/datagov.state.json', {style : getStyleState, onEachFeature: onEachFeature});
        countyLayer = new L.GeoJSON.AJAX('data/datagov.county.json', {style : getStyleCounty, onEachFeature: onEachFeature});
        
        currentLayer = stateLayer;
        currentLayer.addTo(map);
    });

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