(function() {

  angular
  .module('theme.core.reception_controller', [])
  .controller('receptionController', receptionController);

  receptionController.$inject = ['$filter', '$theme', 'MobileService',
  'IncidentService', 'UtilsService', '$modal', '$bootbox', 'SettingsService', 'ClientsService', 'toastr', 'uiGridConstants'];

  function receptionController($filter, $theme, MobileService, IncidentService, UtilsService, $modal, $bootbox,
    SettingsService, ClientsService, toastr, uiGridConstants) {
      'use strict';

      var vm                   = this;
      vm.sexOptions            = SettingsService.sexOptions;
      vm.operativeGradeOptions = SettingsService.operativeGradeOptions;
      vm.ivaSituationsOptions  = SettingsService.ivaSituationsOptions;

      vm.incService = IncidentService;
      vm.cliService = ClientsService;
      console.log(vm.incService.incident);

      vm.incService.incident.sexSelected            = vm.sexOptions[0];
      vm.incService.incident.operativeGradeSelected = vm.operativeGradeOptions[0];
      vm.incService.incident.ivaSituationsSelected  = vm.ivaSituationsOptions[0];

      vm.incService.incident.inputBlocked = true;

      vm.saveIncident       = saveIncident;
      vm.cancelIncident     = cancelIncident;
      vm.createIncident     = createIncident;
      vm.firstIncident      = firstIncident;
      vm.previousIncident   = previousIncident;
      vm.nextIncident       = nextIncident;
      vm.lastIncident       = lastIncident;
      vm.inactivateIncident = inactivateIncident;
      vm.getDataByPhone     = getDataByPhone;
      vm.validateClient     = validateClient;
      vm.validateAffiliate  = validateAffiliate;
      vm.validateLocality   = validateLocality;
      vm.affiliateKeyPress  = affiliateKeyPress;
      vm.symptomsKeyPress   = symptomsKeyPress;

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

      function symptomsKeyPress(keyCode) {
        if (keyCode === 113) {
          showSymptomsSearchModal();
        }
      }

      // --> Funciones de la barra de navegacion de panel de recepción

      function createIncident() {
        vm.buttonsDisabled = true;
        IncidentService.getNewIncidentNumberToCreate()
        .then(function(response){
          resetIncident();
          console.log(response);
          vm.incService.incident.number = response.data;
          vm.incService.incident.inputBlocked = false;
        }, function(error){
          console.log(error);
        });

      }

      function saveIncident() {
        //console.log('puto');
      }

      function cancelIncident() {

      }

      function inactivateIncident() {
        resetIncident();
        vm.incService.incident.inputBlocked = true;
        vm.buttonsDisabled = false;
      }

      function firstIncident() {
        IncidentService.getFirst()
        .then(function(response){
          IncidentService.setIncident(response.data);
        });
      }

      function lastIncident() {
        IncidentService.getLast()
        .then(function(response){
          IncidentService.setIncident(response.data);
        });
      }

      function nextIncident() {
        if (vm.incService.incident.id) {
          IncidentService.getNext(vm.incService.incident.id)
          .then(function(response){
            if (response.data.ID !== 0) {
              IncidentService.setIncident(response.data);
            }

          });
        }
      }

      function previousIncident() {
        if (vm.incService.incident.id) {
          IncidentService.getPrevious(vm.incService.incident.id)
          .then(function(response){
            if (response.data.ID !== 0) {
              IncidentService.setIncident(response.data);
            }

          });
        }
      }

      function getDataByPhone() {
        if (vm.incService.incident.phoneNumber) {
          IncidentService.getByPhone(vm.incService.incident.phoneNumber)
          .then(function(response){
            var data = UtilsService.toCamel(response.data);
            console.log('data de phone');
            console.log(data);
            if (data.paciente) {
              $bootbox.confirm('¿El paciente es ' + data.paciente + '?', function(result) {
                if (result) {
                  IncidentService.setIncident(data);
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
        if (vm.incService.incident.client) {
          ClientsService.getClientWithValidation(vm.incService.incident.client)
          .then(function(response){
            console.log(response.data);
            var client = UtilsService.toCamel(response.data);
            if (!client) {
              toastr.warning("El cliente no se encuentra activo");
            }
            if (client.estadoMorosidad) {
              toastr.warning(client.estadoMorosidad);
            }

            ClientsService.getPlansByClient(client.abreviaturaId)
            .then(function(response){
              ClientsService.setPlans(response.data);
            }, function(error){
              console.log(error);
            });

          }, function(error){
            console.log(error);
          });
        }
      }

      function validateAffiliate() {
        if (vm.incService.incident.client && vm.incService.incident.affiliateNumber) {
          ClientsService.getAffiliateWithValidation(vm.incService.incident.client, vm.incService.incident.affiliateNumber)
          .then(function(response) {
            var data = UtilsService.toCamel(response.data);
            IncidentService.setIncident(data);
          }, function(error){
            console.log(error);
          });
        }

      }

      function validateLocality() {
        if (vm.incService.incident.locAbreviature) {
          IncidentService.validateLocality(vm.incService.incident.locAbreviature)
          .then(function(response) {
            var locality = UtilsService.toCamel(response.data);
            setLocality(locality);
          }, function(error) {
            console.log(error);
          })
        }
      }

      function resetIncident() {
        vm.incService.incident = {};
        vm.incService.incident.domicile = {};
        vm.incService.incident.incDate = moment().format("DD/MM/YYYY");
      }

      function setLocality(locality) {
        vm.incService.incident.partido = locality.partido.descripcion +
        ' (' + locality.province.abreviaturaId + '-' + locality.geographicZone.descripcion + ')';
        vm.incService.incident.locality = locality.descripcion;

      }

      function openDatepicker($event) {
        $event.preventDefault();
        $event.stopPropagation();

        vm.datepicker.opened = true;
      }

      // private functions

      function showAffiliateSearchModal() {
        if (vm.incService.incident.client) {

          $modal.open({
            templateUrl: 'clients-search-modal.html',
            controller: function($scope, $modalInstance) {

              $scope.modalClientsSearch                   = {};
              $scope.modalClientsSearch.clientsAreLoading = true;
              $scope.modalClientsSearch.selectedRow       = null;
              $scope.modalClientsSearch.data              = [];
              // --> Comienza F2 en affiliates
              $scope.modalClientsSearch.gridOptions =  {
                data: 'modalClientsSearch.data',
                columnDefs: [
                  { displayName: 'Cliente', field: 'AbreviaturaId' },
                  { displayName: 'Nro. Afiliado', field: 'NroAfiliado' },
                  { displayName: 'Tipo', field: 'TipoIntegrante' },
                  { displayName: 'Apellido', field: 'Apellido' },
                  { displayName: 'Nombre', field: 'Nombre' },
                  { displayName: 'Documento', field: 'Documento' }],
                  enableRowSelection: true,
                  enableRowHeaderSelection: false,
                  multiSelect: false,
                  modifierKeysToMultiSelect : true,
                  noUnselect: true,
                  showFooter: false,
                  enableFiltering: true,
                  showFilter: true,
                  enableHorizontalScrollbar : uiGridConstants.scrollbars.NEVER,
                  onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;

                    $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row){
                      $scope.modalClientsSearch.selectedRow = row;
                    });
                  }
                };

                ClientsService.getClientMembersByClient(vm.incService.incident.client)
                .then(function(response){

                  $scope.modalClientsSearch.data = response.data;
                  $scope.modalClientsSearch.gridOptions.enableFiltering = true;
                  $scope.modalClientsSearch.clientsAreLoading = false;

                }, function(error){
                  $scope.modalClientsSearch.clientsAreLoading = false;
                  console.log(error);
                })

                // --> Termina F2 en affiliates

                $scope.ok = function() {
                  if (!$scope.modalClientsSearch.selectedRow) {
                    toastr.warning('Debe seleccionar al menos un cliente');
                    return;
                  }

                  vm.incService.incident.affiliateNumber = $scope.modalClientsSearch.selectedRow.entity.NroAfiliado;
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

        // --> Popup busqueda de sintomas
        function showSymptomsSearchModal() {
          $modal.open({
            templateUrl: 'symptoms-search-modal.html',
            controller: function($scope, $modalInstance) {

              $scope.modalSymptomsSearch                             = {};
              $scope.modalSymptomsSearch.selectedRow               = null;
              $scope.modalSymptomsSearch.data                        = SettingsService.symptoms;

              $scope.modalSymptomsSearch.gridOptions =  {
                data: 'modalSymptomsSearch.data',
                selectedItems : $scope.modalSymptomsSearch.selectedItems,
                columnDefs: [
                  { displayName: 'Descripción', field: 'descripcion' }],
                  enableRowSelection: true,
                  enableRowHeaderSelection: false,
                  multiSelect: false,
                  modifierKeysToMultiSelect : true,
                  noUnselect: true,
                  showFooter: false,
                  enableFiltering: true,
                  showFilter: true,
                  enableHorizontalScrollbar : uiGridConstants.scrollbars.NEVER,
                  onRegisterApi : function(gridApi) {
                    $scope.gridApi = gridApi;

                    $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row){
                      $scope.modalSymptomsSearch.selectedRow = row;
                    });
                  }
                };

                $scope.ok = function() {
                  if (!$scope.modalSymptomsSearch.selectedRow) {
                    toastr.warning('Debe seleccionar al menos un síntoma');
                    return;
                  }

                  vm.incService.incident.symptoms = $scope.modalSymptomsSearch.selectedRow.entity.descripcion;
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
      })();
