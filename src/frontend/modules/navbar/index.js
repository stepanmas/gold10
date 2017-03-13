"use strict";

class Navbar {
    constructor($scope, $rootScope)
    {
        this.$scope    = $scope;
        $scope.name    = 'Gold10';
        $scope.curPage = 'Remember';
        
        $scope.links = [
            {
                title: 'Remember',
                src  : '#!/'
            },
            {
                title: 'Add',
                src  : '#!/add'
            },
            {
                title: 'Learn',
                src  : '#!/learn'
            }
        ];
        
        if (localStorage.getItem('username'))
            $scope.username = localStorage.getItem('username');
        else
            $scope.username = 'Sign in/up';
        
        $rootScope.setActive   = this.setActive.bind(this);
        $rootScope.setUsername = this.setUsername.bind(this);
    }
    
    setActive(name)
    {
        this.$scope.curPage = name;
    }
    
    setUsername(name)
    {
        this.$scope.username = name;
    }
}

export default Navbar;