(function () {

  'use strict';

  angular
  .module('theme.core.services')
  .factory('IncidentService', IncidentService)

  IncidentService.$inject = [ '$http', '$rootScope', 'shamanConfiguration'];
  /* jshint ignore:start */
  function IncidentService($http, $rootScope, shamanConfiguration) {

    function getAll() {
      return $http.get(shamanConfiguration.url + 'api/incidents');
    }

    var service = {
      getAll : getAll
    };

    return service;

  }

})();
