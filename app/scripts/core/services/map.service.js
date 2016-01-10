(function () {

  'use strict';

  angular
  .module('theme.core.services')
  .factory('MapService', MapService)

  MapService.$inject = [ '$http', '$rootScope', 'shamanConfiguration'];
  /* jshint ignore:start */
  function MapService($http, $rootScope, shamanConfiguration) {

    function setMapVisible(mapVisibility) {
      service.data.seeMap = mapVisibility;
    }

    var service = {
      setMapVisible : setMapVisible
    };

    service.data = {};
    service.data.seeMap = true;

    return service;

  }

})();
