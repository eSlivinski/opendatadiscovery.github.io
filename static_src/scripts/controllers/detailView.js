app.controller('detailViewCtrl', function($scope, $sce) {
  $scope.trustUrl = function(url) {
    return $sce.trustAsResourceUrl(url);
  };
});
