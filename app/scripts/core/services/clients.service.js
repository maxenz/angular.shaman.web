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

    function getPlansByClient(client) {
      return UtilsService.getPromise('api/clients/GetPlans?client=' + client);
    }

    function getAffiliateWithValidation(clientAbreviaturaId, affiliateNumber) {
      return UtilsService.getPromise('api/clients/GetAffiliateWithValidation?clientAbreviaturaId=' + clientAbreviaturaId +
       '&affiliateNumber=' + affiliateNumber);
    }

    function getClientMembersByClient(client) {
      return $http.get(shamanConfiguration.url + 'api/clients/GetMembersByClient?client=' + client);
    }

    function getAll() {
      return UtilsService.getPromise('api/clients/getall');
    }

    function getAllActiveMembers() {
      return UtilsService.getPromise('api/clients/getallclientmembers');
    }

    function setPlans(plans) {
      service.planOptions = [];
      var data = UtilsService.toCamel(plans);
      data.forEach(function(plan){
        service.planOptions.push({id: plan.id, label: plan.descripcion});
      });
    }

    var service = {
      getClientWithValidation    : getClientWithValidation,
      getPlansByClient           : getPlansByClient,
      getAffiliateWithValidation : getAffiliateWithValidation,
      getClientMembersByClient   : getClientMembersByClient,
      setPlans                   : setPlans,
      getAll                     : getAll,
      getAllActiveMembers        : getAllActiveMembers,
      planOptions                : []

    };

    return service;

  }

})();
