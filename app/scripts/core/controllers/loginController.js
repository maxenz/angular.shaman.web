angular
  .module('theme.core.login_controller', [])
  .controller('LoginController', LoginController);

  LoginController.$inject = ['$scope', '$filter', '$theme'];
   function LoginController($scope, $filter, $theme) {

    'use strict';
    
    $theme.set('fullscreen', true);

    $scope.$on('$destroy', function() {
      $theme.set('fullscreen', false);
    });

  }
