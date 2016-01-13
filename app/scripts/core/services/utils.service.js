/**
* Created by Maximiliano on 03/11/2015.
*/
(function(){

  'use strict';

  angular
  .module('theme.core.services')
  .factory('UtilsService', UtilsService)

  UtilsService.$inject = ['$http', 'shamanConfiguration'];

  function UtilsService($http, shamanConfiguration) {

    var service = {
      toCamel						              : toCamel,
      secondsToTime					          : secondsToTime,
      getObjectByPropertyInArray			: getObjectByPropertyInArray,
      stringStartsWith				        : stringStartsWith,
      getPromise                      : getPromise
    };

    return service;

    ///////////////////// Service Functions

    function toCamel(o) {
      var build, key, destKey, value;

      if (o instanceof Array) {
        build = [];
        for (key in o) {
          value = o[key];

          if (typeof value === "object") {
            value = toCamel(value);
          }
          build.push(value);
        }
      } else {
        build = {};
        for (key in o) {
          if (o.hasOwnProperty(key)) {
            if (key !== 'ID') {
              destKey = (key.charAt(0).toLowerCase() + key.slice(1) || key).toString();
            } else {
              destKey = 'id';
            }
            value = o[key];
            if (value !== null && typeof value === "object") {
              value = toCamel(value);
            }

            build[destKey] = value;
          }
        }
      }
      return build;
    }

    function secondsToTime(value) {
      return moment.duration(value, "seconds").format("hh:mm:ss", { trim: false});
    }

    function getObjectByPropertyInArray(vec, property, value) {
      var objSearched = null;
      if (vec) {
        vec.forEach(function(obj){
          if (obj[property] === value) {
            objSearched = obj;
          }
        });
      }

      return objSearched;
    }

    function stringStartsWith(string, prefix) {
      return string.slice(0, prefix.length) == prefix;
    }

    function getPromise(route) {
      return $http.get(shamanConfiguration.url + route);
    }

  }

}());
