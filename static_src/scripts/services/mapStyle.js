app.service('mapStyle', function() {
    var legend = {
        "state": [{"color": "#d7191c", "limit": [6000, 7000]},
                  {"color": "#fdae61", "limit": [7000, 8000]},
                  {"color": "#ffffbf", "limit": [8000, 9500]},
                  {"color": "#abdda4", "limit": [9500, 12000]},
                  {"color": "#2b83ba", "limit": [12000, 20000]}],
        "county": [{"color": "#d7191c", "limit": [3500, 5000]},
                   {"color": "#fdae61", "limit": [5000, 6000]},
                   {"color": "#ffffbf", "limit": [6000, 7000]},
                   {"color": "#abdda4", "limit": [7000, 8000]},
                   {"color": "#2b83ba", "limit": [8000, 12000]}]
    }

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

    this.getStateSymbolStyle = function(feature, level) {
        return {
            fillColor: getLegendColor(feature.properties.data_num,legend['state']),
            weight: 0.3,
            opacity: 1,
            color: 'grey',
            dashArray: '',
            fillOpacity: 0.5
        };
    };

    this.getCountySymbolStyle = function(feature) {
        return {
            fillColor: getLegendColor(feature.properties.data_num, legend['county']),
            weight: 0.3,
            opacity: 1,
            color: 'grey',
            dashArray: '',
            fillOpacity: 0.5
        };
    };

    this.highlightFeature = function(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 2,
            color: 'white',
            dashArray: ''
        });

        if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
        }
    };

    this.resetHighlight = function(e) {
        currentLayer.resetStyle(e.target);
    };

    this.onEachFeature = function(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
        });
    };
});
