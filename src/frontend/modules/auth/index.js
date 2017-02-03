"use strict";

class Auth {
    constructor($scope, $rootScope, $location, socket)
    {
        $rootScope.setActive('Auth');
        
        this.$scope = $scope;
        this.$rootScope = $rootScope;
        $scope.io   = socket;
        
        $scope.email    = null;
        $scope.password = null;
        $scope.submit   = this.submit;
        $scope.status   = {
            show   : false,
            code   : 'danger',
            message: null
        };
        
        this.$location = $location;
        
        socket.on(
            'signed',
            (r) =>
            {
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
    
        socket.on(
            'access error',
            (error) => {
                console.log(error);
                localStorage.removeItem('username');
                localStorage.removeItem('key');
                this.$location.path('/');
                this.$scope.$apply();
            }
        );
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
        localStorage.setItem('username', r.email);
        localStorage.setItem('key', r.key);
        this.$rootScope.setUsername(r.email);
        this.$location.path('/');
        this.$scope.$apply();
    }
}

export default Auth;