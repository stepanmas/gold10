"use strict";

class Remember {
    constructor($scope, $location, socket, getPrivateData)
    {
        this.io        = socket;
        this.$location = $location;
        
        this.bind();
        this.$scope = $scope;
        
        $scope._timeout_count  = 3;
        $scope.started         = false;
        $scope.timeLeft        = false;
        $scope.timeout_counter = $scope._timeout_count;
        
        $scope.start      = this.start.bind(this);
        $scope.randomWord = this.randomWord.bind(this);
        
        socket.emit('today', getPrivateData());
    }
    
    bind()
    {
        this.io.on(
            'today', (r) =>
            {
                this.$scope.today = r;
                this.$scope.$apply();
            }
        );
    }
    
    randomWord(one, two)
    {
        if (this._cache) return this._cache;
        
        this._cache = Math.random() < .5 ? one : two;
        return this._cache;
    }
    
    start()
    {
        this.$scope.started = true;
        
        this._interval = setInterval(
            () =>
            {
                if (this.$scope.timeout_counter)
                {
                    this.$scope.timeout_counter -= 1;
                    this.$scope.$apply();
                }
                else
                {
                    clearInterval(this._interval);
                    
                    let currentCart = document.querySelectorAll('.word-cell li:not(.hide)')[0];
                    
                    currentCart.classList.add('hide');
                    
                    console.log(currentCart.nextSibling.nextSibling);
                    
                    currentCart.nextSibling.nextSibling.classList.remove('hide');
                    this.$scope.timeout_counter = this.$scope.timeout_count;
                    this.$scope.$apply();
                }
            },
            1000
        );
    }
}

export default Remember;