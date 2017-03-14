// Angular and bootstrap
import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import uiRouter from 'angular-ui-router';
import collapse from 'angular-ui-bootstrap/src/collapse';

// Notifer
import '@cgross/angular-notify/dist';
import '@cgross/angular-notify/dist/angular-notify.css';

// Other
import 'style/global.less';
import 'font-awesome-webpack';

// Application
import Remember from 'remember';
import Learn from 'learn';
import Auth from 'auth';
import Navbar from 'navbar';
import Add from 'add';
import 'factorys';

const app = angular.module('app', ['socket', 'getUserData', 'cgNotify', collapse, uiRouter]);

app
    .controller('navbar', ['$scope', '$rootScope', '$timeout', Navbar]);

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
                        controller : ['$scope', '$rootScope', '$location', '$timeout', 'notify', 'io', 'getUserData', Remember],
                        isAuth     : function ()
                        {
                            return (localStorage.getItem('email') && localStorage.getItem('key'));
                        }
                    }
                )
                .state(
                    'learn', {
                        url        : '/learn',
                        templateUrl: "learn/list.html",
                        controller : ['$scope', '$rootScope', '$location', '$timeout', 'notify', 'io', 'getUserData', Learn],
                        isAuth     : function ()
                        {
                            return (localStorage.getItem('email') && localStorage.getItem('key'));
                        }
                    }
                )
                .state(
                    'auth', {
                        url        : '/auth',
                        templateUrl: "auth/form.html",
                        controller : ['$scope', '$rootScope', '$location', 'io', Auth]
                    }
                )
                .state(
                    'add', {
                        url        : '/add?word',
                        templateUrl: "add/form.html",
                        controller : ['$scope', '$rootScope', 'notify', '$http', '$location', 'io', 'getUserData', Add],
                        isAuth: function ()
                        {
                            return (localStorage.getItem('email') && localStorage.getItem('key'));
                        }
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