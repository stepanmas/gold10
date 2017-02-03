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