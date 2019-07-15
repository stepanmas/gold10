"use strict";

class Navbar {
  constructor($scope, $rootScope, $timeout) {
    this.$scope = $scope;
    $scope.name = 'Gold10';
    $scope.curPage = 'Remember';

    $scope.links = [
      {
        title: 'Remember',
        src: '#!/'
      },
      {
        title: 'Add',
        src: '#!/add'
      },
      {
        title: 'Learn',
        src: '#!/learn'
      }
    ];

    if (localStorage.getItem('email')) {
      $scope.email = localStorage.getItem('email');
    } else {
      $scope.email = 'Sign in/up';
    }

    this.$timeout = $timeout;
    $rootScope.setActive = this.setActive.bind(this);
    $rootScope.setEmail = this.setEmail.bind(this);
  }

  setActive(name) {
    this.$scope.curPage = name;
    this.$timeout(
      () => {
        this.$scope.$digest();
      }
    );
  }

  setEmail(name) {
    this.$scope.email = name;
  }
}

export default Navbar;
