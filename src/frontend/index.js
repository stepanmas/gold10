// Angular and bootstrap
import angular from 'angular';
import 'bootstrap/dist/css/bootstrap.css';
import uiRouter from 'angular-ui-router';
import collapse from 'angular-ui-bootstrap/src/collapse';
import buttons from 'angular-ui-bootstrap/src/buttons';

// Notifer
import '@cgross/angular-notify/dist';
import '@cgross/angular-notify/dist/angular-notify.css';

// Other
import 'style/global.scss';

// Application
import Remember from 'remember';
import Learn from 'learn';
import Auth from 'auth';
import Navbar from 'navbar';
import Add from 'add';
import 'factorys';

const app = angular.module('app', ['socket', 'getUserData', 'cgNotify', collapse, buttons, uiRouter]);

app.controller('navbar', ['$scope', '$rootScope', '$timeout', Navbar]);

let Config = app.config(
  [
    '$stateProvider',
    '$urlRouterProvider',
    function ($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state(
          'list', {
            url: '/',
            templateUrl: "remember/list.html",
            controller: [
              '$scope', '$rootScope', '$location', '$timeout', 'notify', 'io', 'getUserData', Remember
            ],
            isAuth: function () {
              return (localStorage.getItem('email') && localStorage.getItem('key'));
            }
          }
        )
        .state(
          'learn', {
            url: '/learn',
            templateUrl: "learn/list.html",
            controller: [
              '$scope', '$rootScope', '$document', '$location', '$timeout', 'notify', 'io', 'getUserData',
              Learn
            ],
            isAuth: function () {
              return (localStorage.getItem('email') && localStorage.getItem('key'));
            }
          }
        )
        .state(
          'auth', {
            url: '/auth',
            templateUrl: "auth/form.html",
            controller: ['$scope', '$rootScope', '$location', '$timeout', 'notify', 'io', Auth]
          }
        )
        .state(
          'add', {
            url: '/add?word',
            templateUrl: "add/form.html",
            controller: ['$scope', '$rootScope', 'notify', '$http', '$location', 'io', 'getUserData', Add],
            isAuth: function () {
              return (localStorage.getItem('email') && localStorage.getItem('key'));
            }
          }
        )
      ;
      $urlRouterProvider.otherwise('/');
    }
  ]
).config(
  [
    '$compileProvider',
    function ($compileProvider) {
      $compileProvider.debugInfoEnabled(true);
    }
  ]
);

Config.run(
  [
    '$rootScope',
    '$location',
    function ($rootScope, $location) {
      $rootScope.$on(
        '$stateChangeStart', function (ev, next) {
          if (next.isAuth && !next.isAuth()) {
            $location.path('/auth');
          }
        }
      );
    }
  ]
);

window.onload = function () {
  setTimeout(
    () => {
      document.getElementById('layout-content-loading').classList.add('off');
    },
    100
  );
};
