(function () {

  'use strict';

  angular
  .module('theme.core.services')
  .factory('DispatchService', DispatchService)

  DispatchService.$inject = [ '$http', '$rootScope', 'shamanConfiguration', 'UtilsService', '$log'];
  /* jshint ignore:start */
  function DispatchService($http, $rootScope, shamanConfiguration, UtilsService, $log) {

    function getDispatchPopupInformation(id, dispatch) {
      var sel = dispatch.dispatchingOptionSelected.id;
      var grade = dispatch.incident.grade;
      var loc = dispatch.incident.locality;
      return UtilsService.getPromise('api/travelincidents/getdespachopopupinformation?id=' + id +
      '&psel=' + sel +
      '&grade=' + grade +
      '&loc=' + loc);
    }

    function dispatch(dispatchData) {

      var travelIncidentVm = {
        id           : dispatchData.incident.travelIncidentId,
        incidentId   : dispatchData.incident.id,
        selectedView : dispatchData.dispatchingOptionSelected,
        movAptoGrado : dispatchData.incident.movAptoGrado,
        movZona      : dispatchData.incident.movZona,
        mobile       : dispatchData.bottomPanelFirstField,
        mobileType   : dispatchData.bottomPanelSecondField,
        state        : dispatchData.bottomPanelThirdField

      };

      return $http({
        method : 'POST',
        url : shamanConfiguration.url +
        'api/travelincidents/dispatch',
        data: $.param(travelIncidentVm)
      });

    }

    var service = {
      getDispatchPopupInformation : getDispatchPopupInformation,
      dispatch                    : dispatch

    };

    return service;

  }

})();
