"use strict";

class Learn {
    constructor($scope, $rootScope, $document, $location, $timeout, notify, socket, getPrivateData) {
        this.io             = socket;
        this.$location      = $location;
        this.$timeout       = $timeout;
        this.$document      = $document;
        this.getPrivateData = getPrivateData;

        $rootScope.setActive('Learn');
        this.bind();
        this.$scope = $scope;

        $scope.input_focus = false;
        $scope.started     = false;
        $scope.list        = [];
        $scope.item        = [];
        $scope.ok          = this.ok.bind(this);
        $scope.start       = this.start.bind(this);
        $scope.saveExample = this.saveExample.bind(this);
        $scope.openHidden  = this.openHidden.bind(this);
        $scope.notify      = notify;

        socket.emit('learn', getPrivateData());
    }

    bind() {
        this.io.off('learn');
        this.io.on(
            'learn', (r) => {
                this.$scope.learn = r;

                if (r.length) {
                    this.$scope.list = [...this.$scope.learn];

                    this.$scope.$digest();
                }
                else {
                    this.$scope.notify('Nothing to learn!');
                }
            }
        );

        this.io.off('savedExample');
        this.io.on(
            'savedExample', (r) => {
                if (!r.error)
                    this.$scope.notify(r.msg);
                else
                    throw new Error(r.error);
            }
        );

        this.$document.off('keyup');
        this.$document.on('keyup', this.keyBooster.bind(this));
    }

    keyBooster(e) {
        let selector;

        if (this.$scope.input_focus) {
            if (e.keyCode === 27) //ESC
            {
                let key = document.querySelectorAll('.key-E');

                if (key.length) key[0].blur();
                this.$scope.input_focus = false;
            }
            return;
        }

        switch (e.keyCode) {
            case 79: // O
                selector = '.key-O';
                break;

            case 13: // Return
                selector = '.key-enter';
                break;

            case 32: // Space
                selector = '.key-space';
                break;

            case 77: // M
                selector = '.key-M';
                break;

            case 69: // E
                selector = '.key-E';
                break;
        }

        if (selector) {
            let key = document.querySelectorAll(selector);

            if (key.length) {
                key[0][key[0].dataset.keyAction ? key[0].dataset.keyAction : 'click']();

                if (selector == '.key-O') {
                    let ib = document.querySelectorAll('.image-box');

                    if (ib.length) {
                        ib[0].classList.remove('grease');
                    }
                }
            }
        }
    }

    openHidden() {
        let ib = document.querySelectorAll('.image-box');

        if (ib.length) {
            ib[0].classList.remove('grease');
        }

        this.$scope.remember = true;
    }

    saveExample() {
        this.io.emit(
            'saveExample',
            {
                original: this.$scope.item[0].original,
                example : this.$scope.example,
            },
            this.getPrivateData()
        );
    }

    ok() {
        this.io.emit('learned', this.$scope.item[0].original, this.getPrivateData());
        this.start();
    }

    start() {
        console.log(this.$scope.list);
        if (!this.$scope.list.length) {
            this.$scope.started = false;
            this.io.emit('learn', this.getPrivateData());
            return;
        }

        // save an updated example
        if (this.$scope.item.length && this.$scope.item[0].example !== this.$scope.example)
            this.saveExample();

        this.$scope.remember = false;
        this.$scope.started  = true;
        this.$scope.item     = [this.$scope.list.shift()];
        this.$scope.example  = this.$scope.item[0].example;
    }
}

export default Learn;