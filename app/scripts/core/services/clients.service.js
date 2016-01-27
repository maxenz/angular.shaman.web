(function () {

  'use strict';

  angular
  .module('theme.core.services')
  .factory('ClientsService', ClientsService)

  ClientsService.$inject = [ '$http', '$rootScope', 'shamanConfiguration', 'UtilsService'];
  /* jshint ignore:start */
  function ClientsService($http, $rootScope, shamanConfiguration, UtilsService) {

    function getClientWithValidation(client) {
      return UtilsService.getPromise('api/clients/GetClientWithValidation?client=' + client);
    }

    function getPlansByClient(id) {
      return UtilsService.getPromise('api/clients/GetPlans?clientId=' + id);
    }

    function getAffiliateWithValidation(clientAbreviaturaId, affiliateNumber) {
      return UtilsService.getPromise('api/clients/GetAffiliateWithValidation?clientAbreviaturaId=' + clientAbreviaturaId +
       '&affiliateNumber=' + affiliateNumber);
    }

    var service = {
      getClientWithValidation    : getClientWithValidation,
      getPlansByClient           : getPlansByClient,
      getAffiliateWithValidation : getAffiliateWithValidation

    };

    return service;

  }

})();
