"use strict";

class Add {
    constructor($scope, $rootScope, $http, $location, socket, getPrivateData)
    {
        this.params = {
            keyup_delay: 2000
        };
        
        this.io        = socket;
        this.$location = $location;
        this.$http     = $http;
        
        this.bind.bind(this)();
        this.$scope = $scope;
        
        socket.emit('today', getPrivateData());
        
        $scope.getTranslate     = this.getTranslate.bind(this);
        $scope.translated       = [];
        $scope.lingualeo_source = {};
    }
    
    getTranslate()
    {
        if(this._keyup_timer) clearTimeout(this._keyup_timer);
    
        this._keyup_timer = setTimeout(
            () => {
                if (this.$scope.phrase.length > 1)
                    this.io.emit('translate', this.$scope.phrase);
            },
            this.params.keyup_delay
        );
    }
    
    bind()
    {
        this.io.on(
            'translated',
            r =>
            {
                r = JSON.parse(r);
                
                if (r.error_msg)
                {
                    console.error(r.error_msg);
                    return;
                }
                
                // code
                
                this.$scope.$digest();
                
                console.log(r);
            }
        );
    }
}

export default Add;