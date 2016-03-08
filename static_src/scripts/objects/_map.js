app.service('_map', function() {
    var map = L.map('map', {
        center: [38.484656, -96.862625],
        zoom: 4,
        worldCopyJump: true,
        zoomControl: false
    });

    L.control.zoom({ position: 'topright' }).addTo(map);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
      	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
      	subdomains: 'abcd',
      	maxZoom: 19
    }).addTo(map);

    return map;
});
