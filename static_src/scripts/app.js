/*
* @Author: haoliang
* @Date:   2015-08-28 08:52:32
* @Last Modified by:   haoliang
* @Last Modified time: 2015-08-28 09:01:30
*/


var app = angular.module('openDataDiscovery', ['ui.bootstrap'])
                .constant('_', window._)
                .run(function ($rootScope) {
                    $rootScope._ = window._;
                });
