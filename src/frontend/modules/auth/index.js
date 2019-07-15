"use strict";

class Auth {
  constructor($scope, $rootScope, $location, $timeout, notify, socket) {
    this.notify = notify;
    this.$scope = $scope;
    this.$rootScope = $rootScope;
    this.io = socket;
    this.$timeout = $timeout;

    $scope.email = null;
    $scope.password = null;
    $scope.submit = this.submit.bind(this);
    $scope.openPassword = this.openPassword.bind(this);
    $scope.status = {
      show: false,
      code: 'danger',
      message: null
    };

    this.$location = $location;

    this.bind();
    $rootScope.setActive('Remember');
  }

  bind() {
    this.io.off('signed');
    this.io.on(
      'signed',
      (r) => {
        console.log('signed');
        if (r.error) {
          this.$scope.status = {
            show: true,
            code: r.code || 'danger',
            message: r.error
          };
          this.$scope.$digest();
          return;
        }

        Object.assign(this.$scope.status, { show: false });
        this.$scope.$digest();

        this.signed(r);
      }
    );

    this.io.off('access error');
    this.io.on(
      'access error',
      (error) => {
        this.notify(error.error);
        localStorage.removeItem('email');
        localStorage.removeItem('key');
      }
    );
  }

  submit() {
    this.io.emit(
      'signin',
      {
        email: this.$scope.email,
        password: this.$scope.password
      }
    );
  }

  signed(r) {
    localStorage.setItem('email', r.email);
    localStorage.setItem('key', r.key);
    this.$rootScope.setEmail(r.email);
    this.$location.path('/');
    this.$scope.$apply();
  }

  openPassword(e) {
    let field = angular.element(e.currentTarget.parentNode.querySelectorAll('.openPassword'));

    if (field.attr('type') === 'password') {
      field.attr('type', 'text');
    } else {
      field.attr('type', 'password');
    }
  }
}

export default Auth;
