"use strict";

class Remember {
    constructor($scope, $location, $timeout, notify, socket, getPrivateData)
    {
        console.log('Remember constructor');
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
        $scope.randomWord = this.randomWord.bind(this);
        $scope.notify     = notify;
        
        socket.emit('today', getPrivateData());
    }
    
    bind()
    {
        this.io.off('today');
        this.io.on(
            'today', (r) =>
            {
                console.log('got today event');
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
    }
    
    randomWord(one, two)
    {
        return Math.random() < 0.5 ? one : two;
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
        this.$scope.counter  = 3;
        
        this._timer = this.timeout();
    }
}

export default Remember;