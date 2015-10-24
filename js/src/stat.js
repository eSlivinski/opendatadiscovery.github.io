/* 
* @Author: haoliang
* @Date:   2015-08-26 21:11:01
* @Last Modified by:   haoliang
* @Last Modified time: 2015-08-28 15:19:50
*/

'use strict';

app.controller('statController', ["$scope", '$http', function($scope, $http) {
    $http.get('data/stat.json')
         .then(function(response) {
            $scope.statData = response.data;
    });
	
    $scope.xFunction = function() {
    	return function(d) {
    		return d.key;
    	};
    };

    $scope.yFunction = function() {
    	return function(d) {
    		return d.y;
    	};
     };

    $scope.getPieColor = function() {
    	return function(d, i) {
    		return d.color;
    	};
    };

    $scope.getPieTipState = function() {
    	return function(d) {
    		return '<div class="chart-tooltip"><p><b>' + d.data.y + '</b> states have published ' + d.data.key + ' datasets.</p></div>';
    	}
    }

    $scope.getPieTipCounty = function() {
    	return function(d) {
    		return '<div class="chart-tooltip"><p><b>' + d.data.y + '</b> counties have published ' + d.data.key + ' datasets.</p></div>';
    	};
    };

    $scope.xAxisTickFormatFunction = function() {
    	return function(d) {
    		return $scope.statData['nation']['organizations'][0]['abbreviation'][Number(d)];
    	};
    };

	var format = d3.format('d');
	$scope.orgValueFormatFunction = function(){
		return function(d){
	    	return format(d);
	    };
	};

	$scope.orgToolTipContentFunction = function(){
		return function(d) {
	    	return '<div class="chart-tooltip"><p>' + 
	    			$scope.statData['nation']['organizations'][0]['names'][d.data[0]] + 
	    			' publishes <b>' + 
	    			(d.data[1] / $scope.statData.nation.total * 100).toFixed(2) + 
	    			'%</b> of data in Data.gov.<p><div>';
		}
	}
}]);

