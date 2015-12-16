app.service('_map', function() {
    var map = L.map('map', {
        center: [38.484656, -96.862625],
        zoom: 4,
        worldCopyJump: true,
        zoomControl: false
    });

    L.control.zoom({
        position: 'topright'
    }).addTo(map);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={token}', {
        id: 'dz316424.no2ad5mo',
        token: 'pk.eyJ1IjoiZHozMTY0MjQiLCJhIjoiNzI3NmNkOTcyNWFlNGQxNzU2OTA1N2EzN2FkNWIwMTcifQ.NS8KWg47FzfLPlKY0JMNiQ'
    }).addTo(map);

    return map;
});
