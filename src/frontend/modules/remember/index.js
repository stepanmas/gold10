"use strict";

class Remember {
    constructor($scope, $location, $timeout, notify, socket, getPrivateData)
    {
        this.io        = socket;
        this.$location = $location;
        this.$timeout  = $timeout;
        
        this.bind();
        this.$scope               = $scope;
        this.timeout_for_remember = 3;
        
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
                    this.$scope.remembe.push(r[0]);
                    this.$scope.$apply();
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
    
    start()
    {
        this.$scope.started = true;
    
        this.$timeout(
            () => {
                
                this.$scope.timeLeft -= 1;
                
                if (this.$scope.timeLeft)
                {
                    
                }
                
            },
            1000
        );
    }
}

export default Remember;