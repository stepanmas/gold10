"use strict";

import io from 'socket.io-client';

var socket = io();


class Remember {
    constructor($scope)
    {
        $scope.data = 'here';

        //socket.emit('message', 'here');
    }
}

export default Remember;