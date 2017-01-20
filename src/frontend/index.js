import 'bootstrap/dist/css/bootstrap.css';
import 'style/global.less';
import angular from 'angular';

import State from 'state';
import Remember from 'remember';

const app = angular.module('app', []);

app
    .controller('remember', ['$scope', Remember])
;