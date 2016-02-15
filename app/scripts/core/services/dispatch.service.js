(function () {

  'use strict';

  angular
  .module('theme.core.services')
  .factory('DispatchService', DispatchService)

  DispatchService.$inject = [ '$http', '$rootScope', 'shamanConfiguration', 'UtilsService'];
  /* jshint ignore:start */
  function DispatchService($http, $rootScope, shamanConfiguration, UtilsService) {

    function getDispatchPopupInformation(id, sel) {
      return UtilsService.getPromise('api/travelincidents/getdespachopopupinformation?id=' + id + '&psel=' + sel );
    }

    var service = {
      getDispatchPopupInformation : getDispatchPopupInformation

    };

    return service;

  }

})();
