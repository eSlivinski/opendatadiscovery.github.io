app.factory('mapService', function($rootScope, $http, $compile, $timeout, _map, _sidebar, legendService, config) {

    var currentLayer, currentPopup;

    // initialize map
    _map.on('mousemove', mouseMove);

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

    function mouseInFeature(e) {

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

        _map.closePopup();

        currentPopup = L.popup({ offset: L.point(0, -1), closeButton: false })
            .setLatLng(e.latlng)
            .setContent(info)
            .openOn(_map);

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    }

    function mouseOutsideFeature(e) {
      _map.closePopup();
      currentPopup = undefined;
      currentLayer.resetStyle(e.target);
    }

    function mouseMove(e) {
      if (currentPopup) { currentPopup.setLatLng(e.latlng); }
    }

    function seeDetail(e) {

      var layer = e.target;
      var properties = layer.feature.properties;
      var bounds = layer.getBounds();

      var request = vsprintf('%s/api/%s/detail?name=%s', [
        config.server,
        properties.type,
        properties.name
      ]);
      if (properties.type === 'county') { request += sprintf('&state=%s', properties.state); }

      $http.get(request)
      .then(function(result) {
        var detail = result.data;

        var scope = $rootScope.$new(true);
        scope.place = detail.type === 'county' ? sprintf('%s, %s', detail.name, detail.state) :
                                                 detail.name;
        scope.count = detail.count;
        scope.update = detail.update;

        scope.link = vsprintf('https://catalog.data.gov/dataset?q=&ext_location=%s&ext_bbox=%s',[
          scope.place.replace(' ', '+'),
          vsprintf('%f,%f,%f,%f', [
            bounds.getWest(),
            bounds.getSouth(),
            bounds.getEast(),
            bounds.getNorth()
          ]).replace(',', '%2C')
        ]);

        var content = angular.element('<detail-view></detail-view>');
        _sidebar.setContent($compile(content)(scope)[0]);

        if (!_sidebar.isVisible()) { _sidebar.show(); }
      });
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: mouseInFeature,
            mouseout: mouseOutsideFeature,
            click: seeDetail
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

    return {
      loadStateMap: function() {

        _map.spin(true);

        $http.get(config.server + '/api/state/map')
        .then(function(result) {
          if (currentLayer) { _map.removeLayer(currentLayer); }

          currentLayer = L.geoJson(result.data, {
            style: getStateMapStyle,
            onEachFeature: onEachFeature
          }).addTo(_map);

          var stats = updateStat(result.data, 'state');
          legendService.update(stats, 'state');
        })
        .finally(function() { _map.spin(false); });
      },

      loadCountyMap: function() {

        _map.spin(true);

        $http.get(config.server + '/api/county/map')
        .then(function(result) {
          if (currentLayer) {  _map.removeLayer(currentLayer); }

          currentLayer = L.geoJson(result.data, {
              style: getCountyMapStyle,
              onEachFeature: onEachFeature
          }).addTo(_map);

          var stats = updateStat(result.data, 'county');
          legendService.update(stats, 'county');
        })
        .finally(function() { _map.spin(false); });
      }
    };




});
