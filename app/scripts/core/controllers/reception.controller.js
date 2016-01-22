(function() {

  angular
  .module('theme.core.reception_controller',[])
  .controller('receptionController', receptionController);

  receptionController.$inject = ['$filter', '$theme', 'MobileService',
  'IncidentService', 'UtilsService', '$modal', '$bootbox', 'SettingsService', 'ClientsService', 'toastr'];

  function receptionController($filter, $theme, MobileService, IncidentService, UtilsService, $modal, $bootbox,
    SettingsService, ClientsService, toastr) {
      'use strict';

      var vm = this;

      vm.sexOptions = [ {id: 1, label: 'M'}, {id: 2, label: 'F'}];
      vm.operativeGradeOptions = [];
      vm.plansOptions = [];
      SettingsService.settings.operativeGrades.forEach(function(grade){
        vm.operativeGradeOptions.push({id: grade.id, label: grade.descripcion});
      });
      vm.sexSelected = vm.sexOptions[0];
      vm.operativeGradeSelected = vm.operativeGradeOptions[0];


      vm.incident = {};

      vm.saveIncident   = saveIncident;
      vm.cancelIncident = cancelIncident;
      vm.createIncident = createIncident;
      vm.getDataByPhone = getDataByPhone;
      vm.validateClient = validateClient;
      vm.validateAffiliate = validateAffiliate;

      vm.datepicker = {};
      vm.datepicker.format = 'dd/MM/yyyy';
      vm.datepicker.open = openDatepicker;
      vm.datepicker.dateOptions = {
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
        if (vm.incident.phoneNumber) {
          IncidentService.getByPhone(vm.incident.phoneNumber)
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
        ClientsService.getClientWithValidation(vm.incident.client)
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
              vm.plansOptions.push({id: plan.id, label: plan.descripcion});
            });
          }, function(error){
            console.log(error);
          });

        }, function(error){
          console.log(error);
        });
      }

      function validateAffiliate() {
        ClientsService.getAffiliateWithValidation(vm.incident.client, vm.incident.affiliateNumber)
        .then(function(response) {
          console.log(response.data);
        });
      }

      function resetIncident() {
        vm.incident = {};
        vm.incident.domicile = {};
        vm.incident.incDate = moment().format("DD/MM/YYYY");
      }

      function setIncident(incident) {

        resetIncident();
        vm.incident.age = incident.edad;
        vm.incident.afiliateNumber = incident.nroAfiliado;
        vm.incident.client = incident.abreviaturaId;
        vm.incident.advertise = incident.aviso;
        vm.incident.patient = incident.paciente;
        vm.incident.phoneNumber = incident.telefono;
        vm.incident.locAbreviature = incident.localidad;
        vm.incident.locality = incident.localidadDescripcion;
        vm.incident.partido = incident.partido;
        vm.incident.domicile.street = incident.calle;
        vm.incident.domicile.height = incident.altura;
        vm.incident.domicile.floor = incident.piso;
        vm.incident.domicile.department = incident.departamento;
        vm.incident.domicile.betweenFirstStreet = incident.entreCalle1;
        vm.incident.domicile.betweenSecondStreet = incident.entreCalle2;
        vm.sexSelected = UtilsService.getObjectByPropertyInArray(vm.sexOptions, 'label', incident.sexo);

      }

      function openDatepicker($event) {
        $event.preventDefault();
        $event.stopPropagation();

        vm.datepicker.opened = true;
      }

    }
  })();
