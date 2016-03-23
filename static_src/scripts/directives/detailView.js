app.directive('detailView', function() {
    return {
      restrict: "E",
      controller: 'detailViewCtrl',
      scope: false,
      link: function(scope, element, attrs) {},
      templateUrl: 'static/views/detail-view.html'
    };
});
