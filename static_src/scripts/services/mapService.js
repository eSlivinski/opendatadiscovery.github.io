app.service('mapService', function($http, config, _map) {

    var currentLayer, currentPopup;

    var limits = {
        state: [14000, 12000, 10000, 8000],
        county: [8000, 7500, 7000, 6500]
    };

    function getMapColor(count, type) {
        return count > limits[type][0] ? '#ffffcc' :
               count > limits[type][1] ? '#a1dab4' :
               count > limits[type][2] ? '#41b6c4' :
               count > limits[type][3] ? '#2c7fb8' :
                                         '#253494';
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
            info = properties.name + ', ' + properties.state + ' has ' + properties.count.toString() + ' open datasets.';
        } else {
            info = properties.name + ' has ' + properties.count.toString() + ' open datasets.';
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

    this.loadStateMap = function() {
        $http.get(config.local + '/api/state/map')
        .then(function(result) {
            if (currentLayer) { _map.removeLayer(currentLayer); }

            currentLayer = L.geoJson(result.data, {
                style: getStateMapStyle,
                onEachFeature: onEachFeature
            }).addTo(_map);
        });
    };

    this.loadCountyMap = function() {
      $http.get(config.local + '/api/county/map')
      .then(function(result) {
          if (currentLayer) {  _map.removeLayer(currentLayer); }

          currentLayer = L.geoJson(result.data, {
              style: getCountyMapStyle,
              onEachFeature: onEachFeature
          }).addTo(_map);
      });
    };

});
