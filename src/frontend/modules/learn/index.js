"use strict";

class Learn {
    constructor($scope, $rootScope, $location, $timeout, notify, socket, getPrivateData)
    {
        this.io             = socket;
        this.$location      = $location;
        this.$timeout       = $timeout;
        this.getPrivateData = getPrivateData;
        
        $rootScope.setActive('Learn');
        this.bind();
        this.$scope = $scope;
        
        $scope.started     = false;
        $scope.list        = [];
        $scope.item        = [];
        $scope.ok          = this.ok.bind(this);
        $scope.start       = this.start.bind(this);
        $scope.saveExample = this.saveExample.bind(this);
        $scope.notify      = notify;
        
        socket.emit('learn', getPrivateData());
    }
    
    bind()
    {
        this.io.off('learn');
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
        
        this.io.off('savedExample');
        this.io.on(
            'savedExample', (r) =>
            {
                if (!r.error)
                    this.$scope.notify(r.msg);
                else
                    throw new Error(r.error);
            }
        );
    }
    
    saveExample()
    {
        this.io.emit(
            'saveExample',
            {
                original: this.$scope.item[0].original,
                example : this.$scope.example,
            },
            this.getPrivateData()
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
        
        // save an updated example
        if (this.$scope.item.length && this.$scope.item[0].example !== this.$scope.example)
            this.saveExample();
        
        this.$scope.started = true;
        this.$scope.item    = [this.$scope.list.shift()];
        this.$scope.example = this.$scope.item[0].example;
    }
}

export default Learn;