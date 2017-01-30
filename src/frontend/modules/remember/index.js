"use strict";

class Remember {
    constructor($scope, $location, socket)
    {
        this.io = socket;
        this.$location = $location;

        this.bind();
        this.$scope = $scope;

        socket.emit('today');
    }

    bind()
    {
        this.io.on(
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