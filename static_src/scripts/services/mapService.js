app.service('mapService', function($rootScope, $http, config, _map, _sidebar, legendService) {

    var currentLayer;

    function getMapColor(count, type) {
        for(var i = 0, n = legendService.limits[type].length; i < n; i++) {
            if (count > legendService.limits[type][i]) {
                return legendService.colors[i];
            }
        }

        return legendService.colors[legendService.colors.length - 1];
    }

    function getStateMapStyle(feature) {
        return {
            fillColor: getMapColor(feature.properties.count, 'state'),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    function getCountyMapStyle(feature) {
        return {
            fillColor: getMapColor(feature.properties.count, 'county'),
            weight: 0.5,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        // get the content of popup
        var properties = layer.feature.properties;
        var info;
        if (properties.state) {
            info = properties.name + ', ' + properties.state + ' has ' + properties.count.toString() + ' open datasets.\n(click for more detail)';
        } else {
            info = properties.name + ' has ' + properties.count.toString() + ' open datasets.\n(click for more detail)';
        }

        // calculate the location of popup
        var bound = e.layer.getBounds();
        var east = bound.getEast();
        var west = bound.getWest();
        var north = bound.getNorth();
        var location = L.latLng(north, (east + west) / 2);

        _map.closePopup();
        currentPopup = L.popup({ offset: L.point(0, 0) })
            .setLatLng(location)
            .setContent(info)
            .openOn(_map);

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }

    function resetHighlight(e) {
        _map.closePopup();
        currentLayer.resetStyle(e.target);
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
    }

    function updateStat(geojson, type) {
        var min = 0;
        var stat = [];

        for(var i = legendService.limits[type].length - 1; i >= 0; i--) {
            var count = _.filter(geojson.features, function(feature) {
                return feature.properties.count > min &&
                       feature.properties.count < legendService.limits[type][i];
            }).length;

            stat.push(count);
            min = legendService.limits[type][i];
        }

        stat.push(geojson.features.length - _.sum(stat));

        return stat;
    }

    this.loadStateMap = function() {

      _map.spin(true);

      $http.get(config.local + '/api/state/map')
      .then(function(result) {
        if (currentLayer) { _map.removeLayer(currentLayer); }

        currentLayer = L.geoJson(result.data, {
          style: getStateMapStyle,
          onEachFeature: onEachFeature
        }).addTo(_map);

        var stat = updateStat(result.data, 'state');
        $rootScope.$broadcast('state_map:loaded', stat);
      })
      .finally(function() { _map.spin(false); });
    };

    this.loadCountyMap = function() {

      _map.spin(true);

      $http.get(config.local + '/api/county/map')
      .then(function(result) {
        if (currentLayer) {  _map.removeLayer(currentLayer); }

        currentLayer = L.geoJson(result.data, {
            style: getCountyMapStyle,
            onEachFeature: onEachFeature
        }).addTo(_map);

        var stat = updateStat(result.data, 'county');
        $rootScope.$broadcast('county_map:loaded', stat);
      })
      .finally(function() { _map.spin(false); });
    };

});
