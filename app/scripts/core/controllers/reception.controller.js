(function() {

  angular
  .module('theme.core.reception_controller',[])
  .controller('receptionController', receptionController);

  receptionController.$inject = ['$scope', '$filter', '$theme', 'MobileService',
  'IncidentService', 'UtilsService', '$modal', '$bootbox', 'SettingsService', 'ClientsService', 'toastr'];

  function receptionController($scope, $filter, $theme, MobileService, IncidentService, UtilsService, $modal, $bootbox,
     SettingsService, ClientsService, toastr) {
    'use strict';

    $scope.sexOptions = [ {id: 1, label: 'M'}, {id: 2, label: 'F'}];
    $scope.operativeGradeOptions = [];
    $scope.plansOptions = [];
    SettingsService.settings.operativeGrades.forEach(function(grade){
      $scope.operativeGradeOptions.push({id: grade.id, label: grade.descripcion});
    });
    $scope.sexSelected = $scope.sexOptions[0];
    $scope.operativeGradeSelected = $scope.operativeGradeOptions[0];


    $scope.incident = {};

    $scope.saveIncident   = saveIncident;
    $scope.cancelIncident = cancelIncident;
    $scope.createIncident = createIncident;
    $scope.getDataByPhone = getDataByPhone;
    $scope.validateClient = validateClient;

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

    function validateClient() {
      ClientsService.getClientWithValidation($scope.incident.client)
        .then(function(response){
          console.log(response.data);
          var client = UtilsService.toCamel(response.data);
          if (!client) {
            toastr.warning("El cliente no se encuentra activo");
          }
          if (client.estadoMorosidad) {
            toastr.warning("El estado moroso del cliente es : " + client.estadoMorosidad);
          }

          ClientsService.getPlansByClient(client.id)
            .then(function(response){
              var plans = UtilsService.toCamel(response.data);
              plans.forEach(function(plan){
                $scope.plansOptions.push({id: plan.id, label: plan.descripcion});
              });
            }, function(error){
              console.log(error);
            });

        }, function(error){
          console.log(error);
        });
    }

    function resetIncident() {
      $scope.incident = {};
      $scope.incident.domicile = {};
      $scope.incident.incDate = moment().format("DD/MM/YYYY");
    }

    function setIncident(incident) {

      resetIncident();
      $scope.incident.age = incident.edad;
      $scope.incident.afiliateNumber = incident.nroAfiliado;
      $scope.incident.client = incident.abreviaturaId;
      $scope.incident.advertise = incident.aviso;
      $scope.incident.patient = incident.paciente;
      $scope.incident.phoneNumber = incident.telefono;
      $scope.incident.locAbreviature = incident.localidad;
      $scope.incident.locality = incident.localidadDescripcion;
      $scope.incident.partido = incident.partido;
      $scope.incident.domicile.street = incident.calle;
      $scope.incident.domicile.height = incident.altura;
      $scope.incident.domicile.floor = incident.piso;
      $scope.incident.domicile.department = incident.departamento;
      $scope.incident.domicile.betweenFirstStreet = incident.entreCalle1;
      $scope.incident.domicile.betweenSecondStreet = incident.entreCalle2;
      $scope.sexSelected = UtilsService.getObjectByPropertyInArray($scope.sexOptions, 'label', incident.sexo);

    }

    function openDatepicker($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.datepicker.opened = true;
    }

  }
})();
