(function() {

  angular
  .module('theme.core.dispatch_controller', ['ngGrid'])
  .controller('dispatchController', dispatchController);

  dispatchController.$inject = ['$scope', '$filter', '$theme', 'MobileService', 'IncidentService'];
  function dispatchController($scope, $filter, $theme, MobileService, IncidentService) {
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
        { displayName: 'Mov', field: 'Movil' },
        { displayName: 'Zona', field: 'ZonaGeograficaId' },
        { displayName: 'Est', field: 'ValorGrilla' }]
      };

      $scope.gridOptionsIncidents = {
        data: 'incidents',
        columnDefs: [
          { displayName: 'IncidenteId', field: 'IncidenteId' },
          { displayName: 'Gdo', field: 'AbreviaturaId' },
          { displayName: 'Cliente', field: 'Cliente' },
          { displayName: 'Nro', field: 'NroIncidente' },
          { displayName: 'Domicilio', field: 'Domicilio' },
          { displayName: 'Sintomas', field: 'Sintomas' },
          { displayName: 'Loc', field: 'Localidad' },
          { displayName: 'SE', field: 'SexoEdad' },
          { displayName: 'Mov', field: 'Movil' },
          { displayName: 'Llam', field: 'horLlamada' },
          { displayName: 'Dsp', field: 'TpoDespacho' },
          { displayName: 'Sal', field: 'TpoSalida' },
          { displayName: 'Dpl', field: 'TpoDesplazamiento' },
          { displayName: 'Ate', field: 'TpoAtencion' },
          { displayName: 'Paciente', field: 'Paciente' },
          { displayName: 'Ref', field: 'dmReferencia' }]
        };

        loadIncidents();

        function loadMobiles() {
          MobileService.getAll()
          .then(function(response){
            $scope.mobiles = response.data;
            $scope.data.mobilesAreLoading = false;
            console.log(response.data);
          }, function(error){
            $scope.data.mobilesAreLoading = false;
            console.log(error);
          })
        }

        function loadIncidents() {

          IncidentService.getAll()
          .then(function(response){
            $scope.incidents = response.data;
            $scope.data.incidentsAreLoading = false;
            loadMobiles();
            console.log(response.data);
          }, function(error){
            $scope.data.incidentsAreLoading = false;
            console.log(error);
          })
        }


      }
    })();
