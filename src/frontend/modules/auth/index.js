"use strict";

class Auth {
    constructor($scope, $rootScope, $location, notify, socket)
    {
        this.notify     = notify;
        this.$scope     = $scope;
        this.$rootScope = $rootScope;
        $scope.io       = socket;
        
        $scope.email    = null;
        $scope.password = null;
        $scope.submit   = this.submit;
        $scope.status   = {
            show   : false,
            code   : 'danger',
            message: null
        };
        
        this.$location = $location;
    
        socket.off('signed');
        socket.on(
            'signed',
            (r) =>
            {
                console.log('signed');
                if (r.error)
                {
                    $scope.status = {
                        show   : true,
                        code   : r.code || 'danger',
                        message: r.error
                    };
                    $scope.$digest();
                    return;
                }
                
                Object.assign($scope.status, {show: false});
                $scope.$digest();
                
                this.signed(r);
            }
        );
    
        socket.off('access error');
        socket.on(
            'access error',
            (error) =>
            {
                this.notify(error.error);
                localStorage.removeItem('email');
                localStorage.removeItem('key');
                this.$location.path('/');
                this.$scope.$apply();
            }
        );
        
        $rootScope.setActive('Remember');
    }
    
    submit()
    {
        this.io.emit(
            'signin',
            {
                email   : this.email,
                password: this.password
            }
        );
    }
    
    signed(r)
    {
        localStorage.setItem('email', r.email);
        localStorage.setItem('key', r.key);
        this.$rootScope.setEmail(r.email);
        this.$location.path('/');
        this.$scope.$apply();
    }
}

export default Auth;