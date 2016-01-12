(function() {

  angular
  .module('theme.core.reception_controller',[])
  .controller('receptionController', receptionController);

  receptionController.$inject = ['$scope', '$filter', '$theme', 'MobileService',
  'IncidentService', 'UtilsService', '$modal', '$bootbox'];

  function receptionController($scope, $filter, $theme, MobileService, IncidentService, UtilsService, $modal, $bootbox) {
    'use strict';

    $scope.incident = {};

    $scope.saveIncident   = saveIncident;
    $scope.cancelIncident = cancelIncident;
    $scope.createIncident = createIncident;
    $scope.getDataByPhone = getDataByPhone;

    $scope.datepicker = {};
    $scope.datepicker.format = 'dd/MM/yyyy';
    $scope.datepicker.open = openDatepicker;
    $scope.datepicker.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    function createIncident() {
      resetIncident();
    }

    function saveIncident() {
      console.log('puto');
    }

    function cancelIncident() {

    }

    function getDataByPhone() {
      if ($scope.incident.phoneNumber) {
        IncidentService.getByPhone($scope.incident.phoneNumber)
        .then(function(response){
          var data = UtilsService.toCamel(response.data);
          if (data.paciente) {
            $bootbox.confirm('¿El paciente es ' + data.paciente + '?', function(result) {
              if (result) {
                setIncident(data);
              }
            });
          }
          console.log(data);
        }, function(error){
          console.log(error);
        });
      }

    }

    function resetIncident() {
      $scope.incident = {};
      $scope.incident.incDate = moment().format("DD/MM/YYYY");
    }

    function setIncident(incident) {

      $scope.incident = {};
      $scope.incident.age = incident.edad;
      $scope.incident.afiliateNumber = incident.nroAfiliado;
      $scope.incident.client = incident.cliente;
      $scope.incident.patient = incident.paciente;

    }

    function openDatepicker($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.datepicker.opened = true;
    }

  }
})();
