"use strict";

class Remember {
    constructor($scope, $location)
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