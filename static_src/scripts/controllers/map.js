/*
* @Author: haoliang
* @Date:   2015-08-08 21:43:57
* @Last Modified by:   haoliang
* @Last Modified time: 2015-08-28 08:54:22
*/

app.controller("mapCtrl", function($scope, $http, _map, mapService) {
    mapService.loadStateMap();
});
