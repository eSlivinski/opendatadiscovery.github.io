var server = '54.175.114.159:10086';

app.service('queryReq', function($http) {
    this.getStateBounary = function() {
        return $http.get(server + '/api/state/boundary');
    };

    this.getCountyBoundary = function() {
        return $http.get(server + '/api/county/boundary');
    };
});
