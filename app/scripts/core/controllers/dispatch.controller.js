(function() {

  angular
  .module('theme.core.dispatch_controller', ['ngGrid'])
  .controller('dispatchController', dispatchController);

  dispatchController.$inject = ['$scope', '$filter', '$theme', 'MobileService', 'IncidentService', '$log',
   'UtilsService', 'uiGridConstants', 'MapService'];
  function dispatchController($scope, $filter, $theme, MobileService, IncidentService, $log,
     UtilsService, uiGridConstants, MapService) {
    'use strict';

    $scope.data = {};
    $scope.gridOptionsMobiles = {};
    $scope.gridOptionsIncidents = {};
    $scope.data.incidentsAreLoading = true;
    $scope.data.mobilesAreLoading = true;
    $scope.mobiles = [];
    $scope.incidents = [];
    $scope.loadMobiles = loadMobiles;
    $scope.loadIncidents = loadIncidents;

    $scope.gridOptionsMobiles = {
      data: 'mobiles',
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

      $scope.gridOptionsIncidents = {
        data: 'incidents',
        columnDefs: [
          { displayName: 'IncidenteId', field: 'IncidenteId', visible: false },
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
          { displayName: 'dmLongitud', field: 'dmLongitud', visible: false }],
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
              IncidentService.getIncidentById(row.entity.incidenteId)
                .then(function(response){
                  IncidentService.setIncident(UtilsService.toCamel(response.data));
                  MapService.setMarker(row.entity.dmLatitud, row.entity.dmLongitud);
                  console.log(row.entity.dmLatitud);
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
            $scope.mobiles = UtilsService.toCamel(response.data);
            $scope.data.mobilesAreLoading = false;
          }, function(error){
            $scope.data.mobilesAreLoading = false;
            console.log(error);
          })
        }

        function loadIncidents() {

          IncidentService.getAll()
          .then(function(response){
            $scope.incidents = UtilsService.toCamel(response.data);
            console.log($scope.incidents);
            $scope.data.incidentsAreLoading = false;
          }, function(error){
            $scope.data.incidentsAreLoading = false;
            console.log(error);
          })
        }


      }
    })();
