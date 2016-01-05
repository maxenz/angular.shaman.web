(function () {

  'use strict';

  angular
  .module('theme.core.services')
  .factory('MobileService', MobileService)

  MobileService.$inject = [ '$http', '$rootScope', 'shamanConfiguration'];
  /* jshint ignore:start */
  function MobileService($http, $rootScope, shamanConfiguration) {

    function getAll() {
      return $http.get(shamanConfiguration.url + 'api/mobiles');
    }

    var service = {
      getAll : getAll
    };

    return service;

  }

})();
