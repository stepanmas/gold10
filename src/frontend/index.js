import 'bootstrap/dist/css/bootstrap.css';
import 'style/global.less';
import angular from 'angular';

import Remember from 'remember';

const app = angular.module('app', []);

console.log(Remember);
app
    .controller('remember', ['$scope', Remember]);
