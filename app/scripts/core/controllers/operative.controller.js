(function() {

  angular
  .module('theme.core.operative_controller', ['theme.google_maps'])
  .controller('operativeController', operativeController);

  operativeController.$inject = ['$scope', '$filter', '$theme', '$window'];
  function operativeController($scope, $filter, $theme, $window) {
    'use strict';

    var vm = this;
    vm.data = {};




  }
})();
