(function() {

  angular
  .module('theme.core.operative_controller', [])
  .controller('operativeController', operativeController);

  operativeController.$inject = ['$scope', '$filter', '$theme'];
  function operativeController($scope, $filter, $theme) {
    'use strict';

    var vm = this;
    vm.data = {};


  }
})();
