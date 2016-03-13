app.service('_sidebar', function(_map) {

    var sidebar = L.control.sidebar('sidebar', {
        position: 'right'
    }).addTo(_map);

    return sidebar;
});
