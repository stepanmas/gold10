import angular from 'angular';

const getPrivateData = angular.module('getUserData', []);

getPrivateData.factory(
    'getUserData', function ()
    {
        return function ()
        {
            return {
                email: localStorage.getItem('email'),
                key  : localStorage.getItem('key')
            };
        };
    }
);