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

    function getClientMembersByClient(client) {
      return $http.get(shamanConfiguration.url + 'api/clients/GetMembersByClient?client=' + client);
    }

    var service = {
      getClientWithValidation    : getClientWithValidation,
      getPlansByClient           : getPlansByClient,
      getAffiliateWithValidation : getAffiliateWithValidation,
      getClientMembersByClient   : getClientMembersByClient

    };

    return service;

  }

})();
