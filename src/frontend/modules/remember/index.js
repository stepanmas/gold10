"use strict";

// to read https://habrahabr.ru/post/180365/
// https://habrahabr.ru/post/250637/
// https://habrahabr.ru/post/182670/
// https://habrahabr.ru/post/250149/

class Remember {
    constructor($scope)
    {
        this.bind();
        this.$scope = $scope;

        socket.emit('today');
    }

    bind()
    {
        socket.on(
            'today', (r) =>
            {
                this.$scope.$apply(
                    () =>
                    {
                        this.$scope.today = r;
                    }
                );
            }
        );
    }
}

export default Remember;