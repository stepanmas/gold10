import angular from 'angular';

const getPrivateData = angular.module('getUserData', []);

getPrivateData.factory(
    'getUserData', function ()
    {
        return function ()
        {
            return {
                username: localStorage.getItem('username'),
                key     : localStorage.getItem('key')
            };
        };
    }
);