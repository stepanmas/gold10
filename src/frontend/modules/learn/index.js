"use strict";

class Remember {
    constructor($scope, $location, $timeout, notify, socket, getPrivateData)
    {
        this.io             = socket;
        this.$location      = $location;
        this.$timeout       = $timeout;
        this.getPrivateData = getPrivateData;
        
        this.bind();
        this.$scope = $scope;
        
        $scope.started = false;
        $scope.list    = [];
        $scope.item    = [];
        $scope.ok      = this.ok.bind(this);
        $scope.start   = this.start.bind(this);
        $scope.notify  = notify;
        
        socket.emit('learn', getPrivateData());
    }
    
    bind()
    {
        this.io.on(
            'learn', (r) =>
            {
                this.$scope.learn = r;
                
                if (r.length)
                {
                    this.$scope.list = [...this.$scope.learn];
                    
                    this.$scope.$digest();
                }
                else
                {
                    this.$scope.notify('Nothing to learn!');
                }
            }
        );
    }
    
    ok()
    {
        this.io.emit('learned', this.$scope.item[0].original, this.getPrivateData());
        this.start();
    }
    
    start()
    {
        if (!this.$scope.list.length)
        {
            this.$scope.started = false;
            this.io.emit('learn', this.getPrivateData());
            return;
        }
        
        this.$scope.started = true;
        this.$scope.item    = [this.$scope.list.shift()];
    }
}

export default Remember;