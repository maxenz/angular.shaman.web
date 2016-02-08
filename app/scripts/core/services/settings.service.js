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
        ivaSituations     : UtilsService.getPromise('api/iva/GetSituations'),
        symptoms          : UtilsService.getPromise('api/symptoms')
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

    function setOperativeGrades(operativeGrades) {
      operativeGrades.forEach(function(grade){
        service.operativeGradeOptions.push({id: grade.id, label: grade.descripcion});
      });
    }

    function setIvaSituations(ivaSituations) {
      ivaSituations.forEach(function(situation){
        service.ivaSituationsOptions.push({id: situation.id, label: situation.abreviaturaId});
      });
    }

    function setSymptoms(symptoms) {
      service.symptoms = symptoms;
    }

    var service = {
      setInitialSettings : setInitialSettings,
      setOperativeGrades : setOperativeGrades,
      setIvaSituations   : setIvaSituations,
      setSymptoms        : setSymptoms
    };

    service.data                  = {};
    service.operativeGradeOptions = [];
    service.ivaSituationsOptions  = [];
    service.sexOptions            = [ {id: 1, label: 'M'}, {id: 2, label: 'F'}];
    service.symptoms              = [];

    return service;

  }

})();
