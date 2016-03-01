(function () {

  'use strict';

  angular
  .module('theme.core.services')
  .factory('DispatchService', DispatchService)

  DispatchService.$inject = [ '$http', '$rootScope', 'shamanConfiguration', 'UtilsService', '$log'];
  /* jshint ignore:start */
  function DispatchService($http, $rootScope, shamanConfiguration, UtilsService, $log) {

    function getDispatchPopupInformation(id, sel) {
      return UtilsService.getPromise('api/travelincidents/getdespachopopupinformation?id=' + id + '&psel=' + sel );
    }

    function dispatch(incident, row) {
      $log.log(incident);
      $log.log(row);
      return null;
    }

    var service = {
      getDispatchPopupInformation : getDispatchPopupInformation,
      dispatch                    : dispatch

    };

    return service;

  }

})();
