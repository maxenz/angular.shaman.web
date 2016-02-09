(function() {

  angular
  .module('theme.core.operative_controller', ['theme.google_maps'])
  .controller('operativeController', operativeController);

  operativeController.$inject = ['$scope', '$filter', '$theme', '$window', 'MapService'];
  function operativeController($scope, $filter, $theme, $window, MapService) {
    'use strict';

    $scope.operative = {};
    $scope.operative.mapService = MapService;

  }
})();
