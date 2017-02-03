import angular from 'angular';
import io from 'socket.io-client';

const socket = angular.module('socket', []);

socket.factory(
    'io', function ()
    {
        return io.connect();
    }
);