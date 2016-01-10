(function() {

  angular
  .module('theme.core.operative_controller', ['theme.google_maps'])
  .controller('operativeController', operativeController);

  operativeController.$inject = ['$scope', '$filter', '$theme', '$window', 'MapService'];
  function operativeController($scope, $filter, $theme, $window, MapService) {
    'use strict';

    $scope.operative = {};
    $scope.operative.data = {};
    $scope.operative.data.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    $scope.operative.mapService = MapService.data;

  }
})();
