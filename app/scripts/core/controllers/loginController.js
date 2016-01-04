angular
.module('theme.core.login_controller', [])
.controller('LoginController', LoginController);

LoginController.$inject = ['$scope', '$filter', '$theme', '$rootScope', '$location', 'AuthenticationService'];
function LoginController($scope, $filter, $theme, $rootScope, $location, AuthenticationService) {
  'use strict';

  $scope.data = {};
  $scope.login = login;

  // --> Seteo de temas
  $theme.set('fullscreen', true);

  $scope.$on('$destroy', function() {
    $theme.set('fullscreen', false);
  });

  AuthenticationService.clearCredentials();

  function login() {
    $scope.data.dataLoading = true;
    AuthenticationService.login($scope.data.username, $scope.data.password)
    .then(function(data){
      AuthenticationService.setCredentials($scope.data.username, $scope.data.password);
      $location.path('/');
    }, function(error){
      switch (error.status) {
        case 401:
        $scope.data.error = 'Los datos de inicio de sesión son inválidos';
        break;
        case 500:
        $scope.data.error = 'Error en el servidor. Intente ingresar luego';
        break;
      }
      $scope.data.dataLoading = false;
    });

  }

}
