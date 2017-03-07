"use strict";

class Add {
    constructor($scope, $rootScope, $http, $location, socket, getPrivateData)
    {
        this.params = {
            key    : 'trnsl.1.1.20170228T160740Z.b6fa93de752857b1.d430dece652de870e2faf5acbf79b12c731cbf01', // https://tech.yandex.ru/keys/?service=trnsl
            url    : {
                yandex    : {
                    translate: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
                    detect   : 'https://translate.yandex.net/api/v1.5/tr.json/detect'
                },
                lingualeo : {
                    translate: 'https://api.lingualeo.com/gettranslates'
                },
                multillect: {
                    translate: 'https://api.multillect.com/translate/json/1.0/410/'
                }
            },
            timeout: 1000
        };
        
        this.io        = socket;
        this.$location = $location;
        this.$http     = $http;
        
        this.bind();
        this.$scope = $scope;
        
        socket.emit('today', getPrivateData());
        
        $scope.getTranslate = this.getTranslate.bind(this);
        $scope.translated   = '';
    }
    
    /*
     * https://translate.yandex.net/api/v1.5/tr.json/detect ?
     key=<API-ключ>
     & text=<текст>
     & [hint=<список вероятных языков текста>]
     & [callback=<имя callback-функции>]
     * */
    _detect(cb)
    {
        if (this._detect_timer) clearTimeout(this._detect_timer);
        
        this._detect_timer = setTimeout(
            () =>
            {
                if (this.$scope.phrase.length > 1)
                {
                    this.$http(
                        {
                            url   : this.params.url.yandex.detect,
                            method: "GET",
                            params: {
                                key : this.params.key,
                                text: this.$scope.phrase,
                                hint: ['ru', 'en']
                            }
                        }
                    ).then(
                        res =>
                        {
                            cb(res.data.lang);
                        },
                        res =>
                        {
                            throw new Error(res.data.code + ' ' + res.data.message);
                        }
                    );
                }
            },
            this.params.timeout
        );
    }
    
    /*
     key=<API-ключ>
     & text=<переводимый текст>
     & lang=<направление перевода>
     & [format=<формат текста>]
     & [options=<опции перевода>]
     & [callback=<имя callback-функции>]
     */
    _translate(lang)
    {
        let toLang = lang === 'ru' ? 'en' : 'ru';
        
        this.$http(
            {
                url   : this.params.url.yandex.translate,
                method: "GET",
                params: {
                    key   : this.params.key,
                    text  : this.$scope.phrase,
                    lang  : toLang,
                    format: 'html'
                }
            }
        ).then(
            res =>
            {
                //console.log(res.data);
                this.$scope.translated = res.data.text;
            },
            res =>
            {
                throw new Error(res.data.code + ' ' + res.data.message);
            }
        );
        
        this.$http(
            {
                url   : this.params.url.multillect.translate,
                method: "GET",
                params: {
                    method: 'translate/api/translate',
                    from  : lang,
                    to    : toLang,
                    text  : this.$scope.phrase,
                    sig   : 'a45aec8270ac8e2d41ba191bd4f741b0'
                }
            }
        ).then(
            res =>
            {
                console.log(res.data);
                //this.$scope.translated = res.data.text;
            },
            res =>
            {
                throw new Error(res.data.code + ' ' + res.data.message);
            }
        );
    
        this.$http(
            {
                url   : this.params.url.lingualeo.translate,
                method: "GET",
                params: {
                    word: this.$scope.phrase
                }
            }
        ).then(
            res =>
            {
                console.log(res.data);
                //this.$scope.translated = res.data.text;
            },
            res =>
            {
                throw new Error(res.data.code + ' ' + res.data.message);
            }
        );
    }
    
    getTranslate()
    {
        this._detect(lang => this._translate(lang));
    }
    
    bind()
    {
        
    }
}

export default Add;