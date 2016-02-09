(function () {

  'use strict';

  angular
  .module('theme.core.services')
  .factory('MapService', MapService)

  MapService.$inject = [ '$http', '$rootScope', 'shamanConfiguration'];
  /* jshint ignore:start */
  function MapService($http, $rootScope, shamanConfiguration) {

    function setMapVisible(mapVisibility) {
      service.seeMap = mapVisibility;
    }

    function setMarker(latitude,longitude) {

      latitude = latitude.replace(',','.');
      longitude = longitude.replace(',','.');

      service.markers = [];
      var marker = {
              id: Date.now(),
              coords: {
                  latitude: latitude,
                  longitude: longitude
              }
          };

      service.center = { latitude : latitude, longitude : longitude};
      service.markers.push(marker);
    }

    var service = {
      setMapVisible : setMapVisible,
      seeMap        : true,
      setMarker     : setMarker,
      center        : {latitude : -34.604585, longitude: -58.381323},
      zoom          : 13,
      markers       : []
    };

    return service;

  }

})();
