"use strict";

class Add {
    constructor($scope, $location, socket, getPrivateData)
    {
        this.io        = socket;
        this.$location = $location;
        
        this.bind();
        this.$scope = $scope;
        
        //socket.emit('today', getPrivateData());
    }
    
    bind()
    {
        
    }
}

export default Add;