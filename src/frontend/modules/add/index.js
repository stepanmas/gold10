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
        
        this.bind.bind(this)();
        this.$scope = $scope;
        
        socket.emit('today', getPrivateData());
        
        $scope.getTranslate     = this.getTranslate.bind(this);
        $scope.translated       = [];
        $scope.lingualeo_source = {};
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
    
    _yandex(lang, toLang)
    {
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
                for (let word of res.data.text)
                {
                    this.$scope.translated.push(
                        {
                            type: 'Yandex',
                            text: word
                        }
                    );
                }
            },
            res =>
            {
                throw new Error(res.data.code + ' ' + res.data.message);
            }
        );
    }
    
    _multillect(lang, toLang)
    {
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
                this.$scope.translated.push(
                    {
                        type: 'Multillect',
                        text: res.data.result.translated
                    }
                );
            },
            res =>
            {
                throw new Error(res.data.code + ' ' + res.data.message);
            }
        );
    }
    
    _lingualeo(lang, toLang)
    {
        this.io.emit('translate', this.$scope.phrase);
    }
    
    _translate(lang)
    {
        let toLang = lang === 'ru' ? 'en' : 'ru';
        
        this.$scope.translated = [];
        this._yandex(lang, toLang);
        this._multillect(lang, toLang);
        this._lingualeo(lang, toLang);
    }
    
    getTranslate()
    {
        this._detect(lang => this._translate(lang));
    }
    
    bind()
    {
        this.io.on(
            'translated',
            r =>
            {
                r = JSON.parse(r);
                
                if (r.error_msg)
                {
                    console.error(r.error_msg);
                    return;
                }
                
                for (let version of r.translate)
                {
                    this.$scope.translated.push(
                        {
                            type   : 'Lingualeo',
                            text   : version.value,
                            pic_url: version.pic_url,
                            rating : version.votes
                        }
                    );
                }
                
                this.$scope.lingualeo_source = r;
                this.$scope.$digest();
                
                console.log(r);
            }
        );
    }
}

export default Add;