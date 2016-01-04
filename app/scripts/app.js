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
    templateUrl: 'views/index.html',
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
.run(['$rootScope', '$location', '$cookieStore', '$http',
function($rootScope, $location, $cookieStore, $http){
  'use strict';
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

}]);
