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

      var vm                   = this;
      vm.sexOptions            = [ {id: 1, label: 'M'}, {id: 2, label: 'F'}];
      vm.operativeGradeOptions = [];
      vm.plansOptions          = [];
      vm.ivaSituationsOptions  = [];

      SettingsService.settings.operativeGrades.forEach(function(grade){
        vm.operativeGradeOptions.push({id: grade.id, label: grade.descripcion});
      });

      SettingsService.settings.ivaSituations.forEach(function(situation){
        vm.ivaSituationsOptions.push({id: situation.id, label: situation.abreviaturaId});
      });

      vm.sexSelected            = vm.sexOptions[0];
      vm.operativeGradeSelected = vm.operativeGradeOptions[0];
      vm.ivaSituationsSelected  = vm.ivaSituationsOptions[0];

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

      vm.datepicker             = {};
      vm.datepicker.format      = 'dd/MM/yyyy';
      vm.datepicker.open        = openDatepicker;
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
        IncidentService.getNewIncidentNumberToCreate()
          .then(function(response){
            resetIncident();
            console.log(response);
            vm.incident.number = response.data;
            vm.incident.inputBlocked = false;
          }, function(error){
            console.log(error);
          });

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
              vm.plansOptions = [];
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

        vm.incident.age                          = incident.edad;
        vm.incident.afiliateNumber               = incident.nroAfiliado;
        vm.incident.client                       = incident.abreviaturaId;
        vm.incident.advertise                    = incident.aviso;
        vm.incident.patient                      = incident.paciente;
        vm.incident.phoneNumber                  = incident.telefono;
        vm.incident.locAbreviature               = incident.localidad.abreviaturaId;
        vm.incident.locality                     = incident.localidad.descripcion;
        vm.incident.partido                      = incident.localidad.partido.descripcion;
        vm.incident.domicile.street              = incident.domicilio.street;
        vm.incident.domicile.height              = incident.domicilio.height;
        vm.incident.domicile.floor               = incident.domicilio.floor;
        vm.incident.domicile.department          = incident.domicilio.department;
        vm.incident.domicile.betweenFirstStreet  = incident.domicilio.betweenStreet1;
        vm.incident.domicile.betweenSecondStreet = incident.domicilio.betweenStreet2;
        vm.sexSelected                           = UtilsService.getObjectByPropertyInArray(vm.sexOptions, 'label', incident.sexo);
        vm.operativeGradeSelected                = UtilsService.getObjectByPropertyInArray(vm.operativeGradeOptions, 'label', incident.gradoOperativo.descripcion);
        vm.ivaSituationSelected                  = UtilsService.getObjectByPropertyInArray(vm.ivaSituationsOptions, 'id', incident.situacionIvaId );
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

              $scope.modalClientsSearch                   = {};
              $scope.modalClientsSearch.clientsAreLoading = true;
              $scope.modalClientsSearch.selectedItems     = [];
              $scope.modalClientsSearch.data              = [];
              // --> Comienza F2 en affiliates
              $scope.modalClientsSearch.gridOptions =  {
                data: 'modalClientsSearch.data',
                multiSelect : false,
                showFilter : true,
                selectedItems : $scope.modalClientsSearch.selectedItems,
                columnDefs: [
                  { displayName: 'Cliente', field: 'AbreviaturaId' },
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
                  console.log($scope.modalClientsSearch.selectedItems[0]);
                  if ($scope.modalClientsSearch.selectedItems.length === 0) {
                    toastr.warning('Debe seleccionar al menos un cliente');
                    return;
                  }

                  vm.incident.affiliateNumber = $scope.modalClientsSearch.selectedItems[0].NroAfiliado;
                  validateAffiliate();
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
