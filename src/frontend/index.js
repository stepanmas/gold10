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

const app = angular.module('app', [uiRouter]);
window.socket = io();

app
    .controller('remember', [Remember])
    .controller('auth', [Auth])

    .config(
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
                            controller : ['$scope', Remember]
                        }
                    )
                    .state(
                        'auth', {
                            url        : '/auth',
                            templateUrl: "auth/form.html",
                            controller : ['$scope', Auth]
                        }
                    )

                    /*.state(
                        'install', {
                            url        : '/auth',
                            templateUrl: "src/modules/install/install.html",
                            controller : ['$scope', InstallPage]
                        }
                    )
                    .state(
                        'lang', {
                            url        : '/add',
                            templateUrl: "src/modules/lang/lang.html",
                            controller : ['$scope', '$stateParams', LangPage]
                        }
                    )
                    .state(
                        'lang', {
                            url        : '/learn',
                            templateUrl: "src/modules/lang/lang.html",
                            controller : ['$scope', '$stateParams', LangPage]
                        }
                    )*/
                ;
                $urlRouterProvider.otherwise('/');
            }
        ]
    )
;