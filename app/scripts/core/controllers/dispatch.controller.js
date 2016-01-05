(function() {

  angular
  .module('theme.core.dispatch_controller', [])
  .controller('dispatchController', dispatchController);

  dispatchController.$inject = ['$scope', '$filter', '$theme', 'MobileService'];
  function dispatchController($scope, $filter, $theme, MobileService) {
    'use strict';

    var vm = this;
    vm.data = {};
    vm.data.seeMap = true;
    vm.data.gridOptionsMobiles = {};
    vm.mobiles = [];

    vm.loadMobiles = loadMobiles;

    loadMobiles();

    function loadMobiles() {
      MobileService.getAll()
      .then(function(response){
        $scope.mobiles = response.data;
      }, function(error){
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

    }
  })();
