angular
.module('themesApp', [
  'theme',
  'theme.demos',
])
.constant('shamanConfiguration', {
  'url': 'http://localhost/Shaman.Web/',
  'port': '80'
})
.config(['$provide', '$routeProvider', function($provide, $routeProvider) {
  'use strict';
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

  SettingsService.setInitialSettings()
  .then(function(response){

    SettingsService.settings.operativeGrades = UtilsService.toCamel(response.operativeGrades.data);
    SettingsService.settings.ivaSituations   = UtilsService.toCamel(response.ivaSituations.data);
    SettingsService.settings.symptoms        = UtilsService.toCamel(response.symptoms.data);

    $http.defaults.headers.post['Content-Type'] = 'application/json';

    $rootScope.globals = $cookieStore.get('globals') || {};
    if ($rootScope.globals.currentUser) {
      $http.defaults.headers.common['Authorization'] = 'Basic' + $rootScope.globals.currentUser.authdata;
    }

    $rootScope.$on('$locationChangeStart', function(event, next, current){
      if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
        $location.path('/login');
      }
    });

  });



}]);
