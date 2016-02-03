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

    function getByPhone(phone) {
      return $http.get(shamanConfiguration.url + 'api/incidents/GetByPhone?phone=' + phone);
    }

    function validateLocality(locality) {
      return $http.get(shamanConfiguration.url + 'api/localities/GetLocalityByAbreviaturaId?locAbreviaturaId=' + locality);
    }

    var service = {
      getAll              : getAll,
      getByPhone          : getByPhone,
      validateLocality    : validateLocality
    };

    return service;

  }

})();
