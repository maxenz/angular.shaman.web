(function () {

  'use strict';

  angular
  .module('theme.core.services')
  .factory('SettingsService', SettingsService)

  SettingsService.$inject = [ '$http', '$rootScope', 'shamanConfiguration', 'UtilsService', '$q'];
  /* jshint ignore:start */
  function SettingsService($http, $rootScope, shamanConfiguration, UtilsService, $q) {

    function getInitialInformation() {
      
      var promises = {
        operativeGrades   : UtilsService.getPromise('api/operativeGrades'),
        ivaSituations     : UtilsService.getPromise('api/iva/GetSituations')
      };

      var deferred = $q.defer();

      $q.all(promises)
      .then(function (results) {
        deferred.resolve(results);
      },
      function (errors) {
        deferred.reject(errors);
      });

      return deferred.promise;
    }

    function setInitialSettings() {

      return getInitialInformation();

    }

    var service = {
      setInitialSettings : setInitialSettings
    };

    service.settings = {};

    return service;

  }

})();
