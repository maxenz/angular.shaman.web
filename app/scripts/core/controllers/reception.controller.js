(function() {

  angular
  .module('theme.core.reception_controller', ['ngGrid'])
  .controller('receptionController', receptionController);

  receptionController.$inject = ['$filter', '$theme', 'MobileService',
  'IncidentService', 'UtilsService', '$modal', '$bootbox', 'SettingsService', 'ClientsService', 'toastr',
  '$scope'];

  function receptionController($filter, $theme, MobileService, IncidentService, UtilsService, $modal, $bootbox,
    SettingsService, ClientsService, toastr, $scope) {
      'use strict';

      var vm = this;

      vm.items = ['item1', 'item2', 'item3'];
      vm.sexOptions = [ {id: 1, label: 'M'}, {id: 2, label: 'F'}];
      vm.operativeGradeOptions = [];
      vm.plansOptions = [];

      SettingsService.settings.operativeGrades.forEach(function(grade){
        vm.operativeGradeOptions.push({id: grade.id, label: grade.descripcion});
      });
      vm.sexSelected = vm.sexOptions[0];
      vm.operativeGradeSelected = vm.operativeGradeOptions[0];


      vm.incident = {};
      vm.incident.inputBlocked = true;

      vm.saveIncident      = saveIncident;
      vm.cancelIncident    = cancelIncident;
      vm.createIncident    = createIncident;
      vm.getDataByPhone    = getDataByPhone;
      vm.validateClient    = validateClient;
      vm.validateAffiliate = validateAffiliate;
      vm.validateLocality  = validateLocality;
      vm.affiliateKeyPress = affiliateKeyPress;



      vm.datepicker = {};
      vm.datepicker.format = 'dd/MM/yyyy';
      vm.datepicker.open = openDatepicker;
      vm.datepicker.dateOptions = {
        formatYear: 'yy',
        startingDay: 1
      };

      function affiliateKeyPress(keyCode) {
        if (keyCode === 113) {
          showAffiliateSearchModal();
        }
      }

      function createIncident() {
        resetIncident();
        vm.incident.inputBlocked = false;
      }

      function saveIncident() {
        //console.log('puto');
      }

      function cancelIncident() {

      }

      function getDataByPhone() {
        if (vm.incident.phoneNumber) {
          IncidentService.getByPhone(vm.incident.phoneNumber)
          .then(function(response){
            var data = UtilsService.toCamel(response.data);
            console.log('data de phone');
            console.log(data);
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
        if (vm.incident.client) {
          ClientsService.getClientWithValidation(vm.incident.client)
          .then(function(response){
            console.log(response.data);
            var client = UtilsService.toCamel(response.data);
            if (!client) {
              toastr.warning("El cliente no se encuentra activo");
            }
            if (client.estadoMorosidad) {
              toastr.warning(client.estadoMorosidad);
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
      }

      function validateAffiliate() {
        if (vm.incident.client && vm.incident.affiliateNumber) {
          ClientsService.getAffiliateWithValidation(vm.incident.client, vm.incident.affiliateNumber)
          .then(function(response) {
            var data = UtilsService.toCamel(response.data);
            console.log('data de afiiliate');
            console.log(data);
            setIncident(data);
          }, function(error){
            console.log(error);
          });
        }

      }

      function validateLocality() {
        if (vm.incident.locAbreviature) {
          IncidentService.validateLocality(vm.incident.locAbreviature)
          .then(function(response) {
            var locality = UtilsService.toCamel(response.data);
            setLocality(locality);
          }, function(error) {
            console.log(error);
          })
        }
      }

      function resetIncident() {
        vm.incident = {};
        vm.incident.domicile = {};
        vm.incident.incDate = moment().format("DD/MM/YYYY");
      }

      function setIncident(incident) {
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

      function setLocality(locality) {
        vm.incident.partido = locality.partido.descripcion +
        ' (' + locality.province.abreviaturaId + '-' + locality.geographicZone.descripcion + ')';
        vm.incident.locality = locality.descripcion;

      }

      function openDatepicker($event) {
        $event.preventDefault();
        $event.stopPropagation();

        vm.datepicker.opened = true;
      }

      // private functions

      function showAffiliateSearchModal() {
        if (vm.incident.client) {

          $modal.open({
            templateUrl: 'clients-search-modal.html',
            controller: function($scope, $modalInstance) {

              $scope.modalClientsSearch = {};
              $scope.modalClientsSearch.clientsAreLoading = true;
              $scope.modalClientsSearch.data = [];
              // --> Comienza F2 en affiliates
              $scope.modalClientsSearch.gridOptions =  {
                data: 'modalClientsSearch.data',
                multiSelect : false,
                showFilter : true,
                columnDefs: [
                  { displayName: 'Cliente', field: 'Cliente' },
                  { displayName: 'Nro. Afiliado', field: 'NroAfiliado' },
                  { displayName: 'Tipo', field: 'TipoIntegrante' },
                  { displayName: 'Apellido', field: 'Apellido' },
                  { displayName: 'Nombre', field: 'Nombre' },
                  { displayName: 'Documento', field: 'Documento' }]
                };

                ClientsService.getClientMembersByClient(vm.incident.client)
                .then(function(response){

                  $scope.modalClientsSearch.data = response.data;
                  $scope.modalClientsSearch.gridOptions.enableFiltering = true,
                  $scope.modalClientsSearch.clientsAreLoading = false;

                }, function(error){
                  $scope.modalClientsSearch.clientsAreLoading = false;
                  console.log(error);
                })

                // --> Termina F2 en affiliates

                $scope.ok = function() {
                  $modalInstance.close();
                };

                $scope.cancel = function() {
                  $modalInstance.dismiss('cancel');
                };
              },
              size: 'lg'
            });

          }
        }



      }
    })();
