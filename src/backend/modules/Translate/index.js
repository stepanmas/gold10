const request = require('request');

module.exports = class {
    constructor()
    {
        this.params = {
            url: {
                yandex: {
                    translate: 'https://translate.yandex.net/api/v1.5/tr.json/translate',
                    detect   : 'https://translate.yandex.net/api/v1.5/tr.json/detect',
                    key      : 'trnsl.1.1.20170228T160740Z.b6fa93de752857b1.d430dece652de870e2faf5acbf79b12c731cbf01'
                },
                
                lingualeo: {
                    translate: 'https://api.lingualeo.com/gettranslates'
                },
                
                multillect: {
                    translate: 'https://api.multillect.com/translate/json/1.0/410/'
                }
            }
        };
    }
    
    _detect(cb)
    {
        if (this.word.length > 1)
        {
            request(
                {
                    url: this.params.url.yandex.detect,
                    qs : {
                        key : this.params.url.yandex.key,
                        text: this.word,
                        hint: ['ru', 'en']
                    }
                }
            ).on(
                'response', res =>
                {
                    res.on(
                        'data', function (data)
                        {
                            cb(JSON.parse(data));
                        }
                    );
                }
            );
        }
    }
    
    _yandex(lang, toLang)
    {
        return request(
            {
                url: this.params.url.yandex.translate,
                qs : {
                    key   : this.params.url.yandex.key,
                    text  : this.word,
                    lang  : toLang,
                    format: 'html'
                }
            }
        );
    }
    
    _multillect(lang, toLang)
    {
        return request(
            {
                url: this.params.url.multillect.translate,
                qs : {
                    method: 'translate/api/translate',
                    from  : lang,
                    to    : toLang,
                    text  : this.word,
                    sig   : 'a45aec8270ac8e2d41ba191bd4f741b0'
                }
            }
        );
    }
    
    _lingualeo(lang, toLang)
    {
        return request(
            {
                url: 'https://api.lingualeo.com/gettranslates',
                qs : {
                    word          : this.word.replace(/&/g, "%26"),
                    include_media : 1,
                    add_word_forms: 1
                }
            }
        );
    }
    
    _translate(lang, cb)
    {
        let toLang = lang === 'ru' ? 'en' : 'ru';
        
        return Promise.all(
            [
                this._yandex(lang, toLang),
                this._multillect(lang, toLang),
                this._lingualeo(lang, toLang)
            ]
        ).then(
            r =>
            {
                let result = [];
                
                for (let arr of r)
                {
                    result.push(arr.on('data'));
                }
                
                return Promise.all(result);
            },
            e =>
            {
                console.error(e);
            }
        ).then(
            r=>
            {
                console.log(r);
            }
        );
    }
    
    run(word, cb)
    {
        this.word = word;
        
        this._detect(
            res =>
            {
                if (res && res.lang)
                {
                    this._translate(
                        res.lang,
                        r =>
                        {
                            cb(r);
                        }
                    );
                }
            }
        );
    }
};