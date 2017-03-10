"use strict";

class Remember {
    constructor($scope, $location, socket, getPrivateData)
    {
        this.io        = socket;
        this.$location = $location;
        
        this.bind();
        this.$scope = $scope;
        
        socket.emit('today', getPrivateData());
    }
    
    bind()
    {
        this.io.on(
            'today', (r) =>
            {
                console.warn(r);
                this.$scope.$apply(
                    () =>
                    {
                        this.$scope.today = r;
                    }
                );
            }
        );
    }
}

export default Remember;