(function() {

  angular
  .module('theme.core.reception_controller',[])
  .controller('receptionController', receptionController);

  receptionController.$inject = ['$scope', '$filter', '$theme', 'MobileService', 'IncidentService'];
  function receptionController($scope, $filter, $theme, MobileService, IncidentService) {
    'use strict';

    $scope.incident = {};
    $scope.datepicker = {};
    $scope.datepicker.format = 'dd-MM-yyyy';
    $scope.datepicker.open = openDatepicker;
    $scope.datepicker.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.incident.save = saveIncident;
    $scope.incident.cancel = cancelIncident;

    function saveIncident() {
console.log('puto');
    }

    function cancelIncident() {

    }

    function openDatepicker($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.datepicker.opened = true;
    }

  }
})();
