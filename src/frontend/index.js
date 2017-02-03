// Angular and bootstrap
import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import uiRouter from 'angular-ui-router';

// Other
import 'style/global.less';
import io from 'socket.io-client';

// Application
import Remember from 'remember';
import Auth from 'auth';

const socket = angular.module('socket', []);

socket.factory(
    'io', function ()
    {
        return io.connect();
    }
);

const app = angular.module('app', ['socket', uiRouter]);

app.config(
        [
            '$stateProvider',
            '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider)
            {
                $stateProvider
                    .state(
                        'list', {
                            url        : '/',
                            templateUrl: "remember/list.html",
                            controller : ['$scope', '$location', 'io', Remember],
                            isAuth: function()
                            {
                                return localStorage.getItem('username');
                            }
                        }
                    )
                    .state(
                        'auth', {
                            url        : '/auth',
                            templateUrl: "auth/form.html",
                            controller : ['$scope', '$location', 'io', Auth]
                        }
                    )
                ;
                $urlRouterProvider.otherwise('/');
            }
        ]
    )
   .run(
       [
           '$rootScope',
           '$location',
           function ($rootScope, $location)
           {
               $rootScope.$on(
                   '$stateChangeStart', function (ev, next)
                   {
                       if (next.isAuth && !next.isAuth())
                           $location.path('/auth');
                   }
               );
           }
       ]
   )
;