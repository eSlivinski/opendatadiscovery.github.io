app.directive('geocoder-view', function() {
    return {
        restrict: "E",
        controller: 'geocoderCtrl',
        scope: {},
        link: {},
        templateUrl: "views/geocoder.html"
    };
});
