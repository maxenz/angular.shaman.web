angular
.module('themesApp', [
  'theme',
  'theme.demos',
])
.constant('shamanConfiguration', {
  'url': 'http://localhost/Shaman.Web/',
  'port': '80'
})
.config(['$provide', '$routeProvider','blockUIConfig', function($provide, $routeProvider, blockUIConfig) {
  'use strict';

  blockUIConfig.message = 'Aguarde un instante. Cargando...';
  blockUIConfig.delay = 100;
  blockUIConfig.autoBlock = false;

  $routeProvider
  .when('/', {
    templateUrl: 'views/operative-panel.html',
    resolve: {
      loadCalendar: ['$ocLazyLoad', function($ocLazyLoad) {
        return $ocLazyLoad.load([
          'bower_components/fullcalendar/fullcalendar.js',
        ]);
      }]
    }
  })
  .when('/:templateFile', {
    templateUrl: function(param) {
      return 'views/' + param.templateFile + '.html';
    }
  })
  .when('#', {
    templateUrl: 'views/index.html',
  })
  .otherwise({
    redirectTo: '/login'
  });
}])
.run(['$rootScope', '$location', '$cookieStore', '$http','SettingsService', 'UtilsService',
function($rootScope, $location, $cookieStore, $http, SettingsService, UtilsService){
  'use strict';

  $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

  SettingsService.setInitialSettings()
  .then(function(response){

    SettingsService.setOperativeGrades(UtilsService.toCamel(response.operativeGrades.data));
    SettingsService.setIvaSituations(UtilsService.toCamel(response.ivaSituations.data));
    SettingsService.setSymptoms(UtilsService.toCamel(response.symptoms.data));

    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
      //$http.defaults.headers.common['Authorization'] = 'Basic' + $rootScope.globals.currentUser.authdata;
    }

    $rootScope.$on('$locationChangeStart', function(event, next, current){
      if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
        $location.path('/login');
      }
    });

  });

}]);
