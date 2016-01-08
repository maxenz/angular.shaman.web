(function() {

  angular
  .module('theme.core.dispatch_controller', [])
  .controller('dispatchController', dispatchController);

  dispatchController.$inject = ['$scope', '$filter', '$theme', 'MobileService', 'IncidentService'];
  function dispatchController($scope, $filter, $theme, MobileService, IncidentService) {
    'use strict';

    var vm = this;
    vm.data = {};
    vm.data.seeMap = true;
    vm.data.gridOptionsMobiles = {};
    vm.data.gridOptionsIncidents = {};
    vm.data.incidentsAreLoading = true;
    vm.data.mobilesAreLoading = true;
    $scope.mobiles = [];
    $scope.incidents = [];


    vm.loadMobiles = loadMobiles;
    vm.loadIncidents = loadIncidents;

    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

    loadIncidents();

    function loadMobiles() {
      MobileService.getAll()
      .then(function(response){
        $scope.mobiles = response.data;
        vm.data.mobilesAreLoading = false;
        console.log(response.data);
      }, function(error){
        vm.data.mobilesAreLoading = false;
        console.log(error);
      })
    }

    function loadIncidents() {

      IncidentService.getAll()
      .then(function(response){
        $scope.incidents = response.data;
        vm.data.incidentsAreLoading = false;
        loadMobiles();
        console.log(response.data);
      }, function(error){
        vm.data.incidentsAreLoading = false;
        console.log(error);
      })
    }

    vm.data.gridOptionsMobiles = {
      data: 'mobiles',
      columnDefs: [
        { displayName: 'Mov', field: 'Movil' },
        { displayName: 'Zona', field: 'ZonaGeograficaId' },
        { displayName: 'Est', field: 'ValorGrilla' }]
      };

      vm.data.gridOptionsIncidents = {
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

    }
  })();
