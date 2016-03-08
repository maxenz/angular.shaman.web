(function() {

  angular
  .module('theme.core.dispatch_controller', ['ngGrid'])
  .controller('dispatchController', dispatchController);

  dispatchController.$inject = ['$scope', '$filter', '$theme', 'MobileService', 'IncidentService', '$log',
  'UtilsService', 'uiGridConstants', 'MapService', '$modal','DispatchService', 'toastr'];
  function dispatchController($scope, $filter, $theme, MobileService, IncidentService, $log,
    UtilsService, uiGridConstants, MapService, $modal, DispatchService, toastr) {
      'use strict';

      var vm                      = this;
      vm.data                     = {};
      vm.gridOptionsMobiles       = {};
      vm.gridOptionsIncidents     = {};
      vm.data.incidentsAreLoading = true;
      vm.data.mobilesAreLoading   = true;
      vm.mobiles                  = [];
      vm.incidents                = [];
      vm.loadMobiles              = loadMobiles;
      vm.loadIncidents            = loadIncidents;
      vm.showDispatchModal        = showDispatchModal;
      vm.selectedIncident         = {};

      vm.ctxMenuIncidents = [
        ['Preasignar', function ($itemScope) {
          $log.log($itemScope);
        }],
        null, // Dividier
        ['Despachar', function ($itemScope) {
          vm.showDispatchModal(vm.selectedIncident);
        }],
        null, // Dividier
        ['Establecer cierre', function ($itemScope) {
          $log.log($itemScope);
        }],
        null, // Dividier
        ['Demora estimada', function ($itemScope) {
          $log.log($itemScope);
        }],
        null, // Dividier
        ['Reclamos / Observaciones / Rechazos', function ($itemScope) {
          $log.log($itemScope);
        }],
        null, // Dividier
        ['Tips / Avisos', function ($itemScope) {
          $log.log($itemScope);
        }]
      ];

      vm.gridOptionsMobiles = {
        data: [],
        columnDefs: [
          { displayName: 'Mov', field: 'movil' },
          { displayName: 'Zona', field: 'zonaGeograficaId' },
          { displayName: 'Est', field: 'valorGrilla' }],
          enableRowSelection: true,
          enableRowHeaderSelection: false,
          multiSelect: false,
          modifierKeysToMultiSelect : true,
          noUnselect: true,
          showFooter: false,
          enableFiltering: true,
          showFilter: true,
          enableHorizontalScrollbar : uiGridConstants.scrollbars.NEVER
        };

        vm.gridOptionsIncidents = {
          data: [],
          columnDefs: [
            { displayName: 'IncidenteId', field: 'IncidenteId', visible: false },
            { displayName: 'incidenteViajeId', field: 'id', visible: false},
            { displayName: 'Gdo', field: 'abreviaturaId', width: '6%' },
            { displayName: 'Cli.', field: 'cliente' , width: '6%'},
            { displayName: 'Nro', field: 'nroIncidente' , width: '5%'},
            { displayName: 'Domic.', field: 'domicilio' , width: '10%'},
            { displayName: 'Sintomas', field: 'sintomas', width: '10%' },
            { displayName: 'Loc', field: 'localidad', width: '6%' },
            { displayName: 'SE', field: 'sexoEdad', width: '6%' },
            { displayName: 'Mov', field: 'movil', width: '6%' },
            { displayName: 'Llam', field: 'horLlamada' , width: '5%'},
            { displayName: 'Dsp', field: 'tpoDespacho' , width: '5%'},
            { displayName: 'Sal', field: 'tpoSalida', width: '5%' },
            { displayName: 'Dpl', field: 'tpoDesplazamiento', width: '5%' },
            { displayName: 'Ate', field: 'tpoAtencion', width: '5%' },
            { displayName: 'Paciente', field: 'paciente', width: '10%' },
            { displayName: 'Ref', field: 'dmReferencia', width: '10%' },
            { displayName: 'dmLatitud', field: 'dmLatitud', visible: false },
            { displayName: 'dmLongitud', field: 'dmLongitud', visible: false },
            { displayName : 'horLlamada' , field: 'horLlamada', visible: false}],
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
              vm.gridApi = gridApi;

              vm.gridApi.selection.on.rowSelectionChanged($scope, function(row){
                IncidentService.getIncidentById(row.entity.incidenteId)
                .then(function(response){
                  IncidentService.setIncident(UtilsService.toCamel(response.data));
                  MapService.setMarker(row.entity.dmLatitud, row.entity.dmLongitud);
                  vm.selectedIncident = row.entity;
                })
              });
            }

          };

          activate();

          function activate() {
            loadIncidents();
            loadMobiles();
          }

          function loadMobiles() {
            MobileService.getAll()
            .then(function(response){
              vm.mobiles = UtilsService.toCamel(response.data);
              vm.gridOptionsMobiles.data = vm.mobiles;
              vm.data.mobilesAreLoading = false;
            }, function(error){
              vm.data.mobilesAreLoading = false;
              console.log(error);
            })
          }

          function loadIncidents() {

            IncidentService.getAll()
            .then(function(response){
              vm.incidents = UtilsService.toCamel(response.data);
              vm.gridOptionsIncidents.data = vm.incidents;
              console.log(vm.incidents);
              vm.data.incidentsAreLoading = false;
            }, function(error){
              vm.data.incidentsAreLoading = false;
              console.log(error);
            })
          }

          function showDispatchModal(incident) {
            $modal.open({
              templateUrl: 'dispatch-modal.html',
              controller: function($scope, $modalInstance) {

                $scope.dispatch                           = {};
                $scope.dispatch.incident                  = {};
                $scope.dispatch.incident.id               = incident.incidenteId;
                $scope.dispatch.incident.travelIncidentId = incident.id;
                $scope.dispatch.incident.number           = incident.nroIncidente;
                $scope.dispatch.incident.grade            = incident.abreviaturaId;
                $scope.dispatch.incident.domicile         = incident.domicilio;
                $scope.dispatch.incident.locality         = incident.localidad;
                $scope.dispatch.incident.incDate          = moment(incident.horLlamada.split(' ')[0], "DD/MM/YYYY")._i;
                $scope.dispatch.dispatchingOptions = [
                  {id: 0, label: 'Móviles'},
                  {id: 1, label: 'Empresas Prestadoras'},
                  {id: 2, label: 'Visitadores'}
                ];

                $scope.ctxDispatchGrid             = {};
                $scope.ctxDispatchGrid.gridOptions = {};
                $scope.dispatch.changeDispatchOption = changeDispatchOption;

                var colDefs = [
                  { displayName: 'id', field: 'id', visible: false},
                  { displayName: 'Móvil', field: 'movil'},
                  { displayName: 'Tipo de Móvil', field: 'tipoMovil'},
                  { displayName: 'Estado', field: 'estado'}
                ];

                var mobileColTitles = ['ID', 'Móvil','Tipo de Móvil', 'Estado'];
                var companyColTitles = ['ID', 'Empresa', 'Nombre', 'Tipo de Cobertura'];

                $scope.ctxDispatchGrid.gridOptions =  {
                  data: [],
                  columnDefs: colDefs,
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
                    $scope.dispatch.dispatchingOptionSelected = $scope.dispatch.dispatchingOptions[0];
                    changeDispatchOption();
                    $scope.gridApi.selection.on.rowSelectionChanged($scope, function(row){
                      $scope.dispatch.selectedRow            = row;
                      $scope.dispatch.bottomPanelFirstField  = row.entity.movil;
                      $scope.dispatch.bottomPanelSecondField = row.entity.tipoMovil;
                      $scope.dispatch.bottomPanelThirdField  = row.entity.estado;
                    });
                  }
                };

                function changeDispatchOption() {
                  switch ($scope.dispatch.dispatchingOptionSelected.id) {
                    case 0:
                    $scope.dispatch.bottomPanelTitle       = 'Móvil';
                    $scope.dispatch.bottomPanelFirstTitle  = 'Móvil';
                    $scope.dispatch.bottomPanelSecondTitle = 'Estado';
                    $scope.dispatch.bottomPanelThirdTitle  = 'Tipo de Móvil';
                    break;
                    case 1:
                    $scope.dispatch.bottomPanelTitle       = 'Empresa';
                    $scope.dispatch.bottomPanelFirstTitle  = 'Empresa';
                    $scope.dispatch.bottomPanelSecondTitle = 'Nombre';
                    $scope.dispatch.bottomPanelThirdTitle  = 'Tipo de Cobertura';
                    break;
                  }

                  setDispatchGridData();

                }

                function setDispatchGridData() {
                  if ($scope.dispatch.dispatchingOptionSelected.id === 0) {
                    setColumnNames(mobileColTitles);
                  } else {
                    setColumnNames(companyColTitles);
                  }

                  DispatchService
                  .getDispatchPopupInformation(incident.id,$scope.dispatch)
                  .then(function(response){
                    $scope.ctxDispatchGrid.gridOptions.data = UtilsService.toCamel(response.data.Sugerencias);
                  });
                }

                function setColumnNames(columns) {
                  colDefs[1].displayName = columns[1];
                  colDefs[2].displayName = columns[2];
                  colDefs[3].displayName = columns[3];
                }

                $scope.ok = function() {
                  if (!$scope.dispatch.selectedRow) {
                    toastr.error('Debe seleccionar al menos una sugerencia.');
                    return;
                  }

                  DispatchService
                  .dispatch($scope.dispatch)
                  .then(function(response){
                    var data = UtilsService.toCamel(response.data);
                    if (data.errorMessages) {
                      toastr.error(data.errorMessages)
                    } else {
                      toastr.success("Se ha realizado el despacho correctamente");
                      loadIncidents();
                      loadMobiles();
                      $modalInstance.close();
                    }
                    $log.log(data);
                  }, function(error){
                      toastr.error(error)
                  });

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
