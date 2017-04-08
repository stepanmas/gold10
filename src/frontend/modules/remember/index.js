"use strict";

class Remember {
    constructor($scope, $rootScope, $location, $timeout, notify, socket, getPrivateData)
    {
        this.io        = socket;
        this.$location = $location;
        this.$timeout  = $timeout;
        this.getPrivateData = getPrivateData;
        
        this.bind();
        this.$scope = $scope;
        
        $scope.started    = false;
        $scope.timeLeft   = false;
        $scope.remembe    = [];
        $scope.start      = this.start.bind(this);
        $scope.ok         = this.ok.bind(this);
        $scope.randomBool = this.randomBool.bind(this);
        $scope.notify     = notify;
        
        socket.emit('today', getPrivateData());
        $rootScope.setActive('Remember');
    }
    
    bind()
    {
        this.io.off('today');
        this.io.on(
            'today', (r) =>
            {
                this.$scope.today = r;
                
                if (r.length)
                {
                    this.$scope.remember = [...this.$scope.today];
                    
                    this.$scope.$digest();
                }
                else
                {
                    this.$scope.notify('Nothing to remember!');
                }
            }
        );
    
        document.removeEventListener('keyup', this.keyBooster.bind(this));
        document.addEventListener('keyup', this.keyBooster.bind(this));
    }
    
    keyBooster(e)
    {
        let selector;
        
        switch (e.keyCode)
        {
            case 32: // Space
                selector = '.key-space';
                break;
    
            case 13: // Return
                selector = '.key-enter';
                break;
        }
        
        if (selector)
        {
            let key = document.querySelectorAll(selector);
            
            if (key.length) key[0][key[0].dataset.keyAction ? key[0].dataset.keyAction : 'click']();
        }
    }

    randomBool() {
        return Math.random() >= .5;
    }
    
    ok(e)
    {
        if (angular.element(e.target).hasClass('prevent-remember') || this.$scope.timeLeft)
        {
            return false;
        }
        
        this.$timeout.cancel(this._timer);
        
        this.start();
    }
    
    forgot()
    {
        if (this.$scope.remembe.length)
        {
            this.io.emit('forgot', this.$scope.remembe[0].original, this.getPrivateData());
        }
    }
    
    timeout()
    {
        return this.$timeout(
            () =>
            {
                if (this.$scope.counter)
                {
                    this._timer = this.timeout();
                }
                else
                {
                    this.$scope.timeLeft = true;
                    this.forgot();
                }
                
                this.$scope.counter -= 1;
                this.$scope.$digest();
            },
            1000
        );
    }
    
    start()
    {
        if (!this.$scope.remember.length)
        {
            this.$scope.started  = false;
            this.$scope.timeLeft = false;
            this.$scope.remember = [...this.$scope.today];
            return;
        }
        
        this.$scope.remembe = [this.$scope.remember.shift()];
        
        this.$scope.started  = true;
        this.$scope.timeLeft = false;
        this.$scope.counter  = 4;
        
        this._timer = this.timeout();
    }
}

export default Remember;