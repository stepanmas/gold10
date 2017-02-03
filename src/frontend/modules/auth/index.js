"use strict";

class Auth {
    constructor($scope, $location, socket)
    {
        $scope.io = socket;
        
        $scope.email    = null;
        $scope.password = null;
        $scope.submit   = this.submit;
        $scope.status   = {
            show   : false,
            code   : 'danger',
            message: null
        };
        
        socket.on(
            'signed',
            function (r)
            {
                console.log(r);
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
                
                Object.assign($scope.status, { show: false });
                $scope.$digest();
                
                
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
}

export default Auth;