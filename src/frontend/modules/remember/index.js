"use strict";

class Remember {
    constructor($scope, $location, $timeout, notify, socket, getPrivateData)
    {
        this.io        = socket;
        this.$location = $location;
        this.$timeout  = $timeout;
        
        this.bind();
        this.$scope = $scope;
        
        $scope.started    = false;
        $scope.timeLeft   = false;
        $scope.current    = 0;
        $scope.remembe    = [];
        $scope.start      = this.start.bind(this);
        $scope.randomWord = this.randomWord.bind(this);
        $scope.notify     = notify;
        
        socket.emit('today', getPrivateData());
    }
    
    bind()
    {
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
    }
    
    randomWord(one, two)
    {
        return Math.random() < .5 ? one : two;
    }
    
    forgot()
    {
        console.log('forgot');
    }
    
    timeout()
    {
        return this.$timeout(
            () =>
            {
                if (this.$scope.counter)
                {
                    this.timeout();
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