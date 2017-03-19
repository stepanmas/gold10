"use strict";

(function ()
{
    if (window.location.host === 'gold10.stepanmas.com' || document.getElementById('gold10_label') || window.location.host === 'localhost:8090')
    {
        return;
    }
    
    class Core {
        id(id)
        {
            return document.getElementById(id);
        }
        
        get(url, cb)
        {
            var xhr = new XMLHttpRequest();
            
            xhr.open('GET', chrome.extension.getURL(url), true);
            xhr.send();
            
            xhr.onreadystatechange = function ()
            {
                if (xhr.status === 200 && xhr.readyState === 4)
                    cb(xhr.responseText);
            };
        }
        
        style(cb)
        {
            this.get(
                '/styles.css', html =>
                {
                    let div       = document.createElement('style');
                    div.innerHTML = html;
                    cb(div);
                }
            );
        }
        
        random(min, max)
        {
            var argc = arguments.length;
            if (argc === 0)
            {
                min = 0;
                max = 2147483647;
            }
            else if (argc === 1)
            {
                throw new Error('Warning: mt_rand() expects exactly 2 parameters, 1 given')
            }
            else
            {
                min = parseInt(min, 10);
                max = parseInt(max, 10);
            }
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        init()
        {
            this.style(
                el =>
                {
                    document.body.appendChild(el);
                }
            );
        }
    }
    class Label {
        constructor(cb)
        {
            core.get(
                '/html/label.html', html =>
                {
                    let div       = document.createElement('div');
                    div.id        = 'gold10_label';
                    div.innerHTML = html;
                    this.el       = div;
                    cb(div);
                }
            );
        }
        
        genKey()
        {
            return core.random(0, this.list.length - 1);
        }
        
        setNext()
        {
            let key     = this.genKey();
            let keys    = ['original', 'translate'];
            let wordKey = core.random(0, 1);
            
            if (key === this.key) return this.setNext();
            
            this.key = key;
            
            this.el.querySelectorAll('span').forEach(
                el =>
                {
                    el.textContent = this.list[this.key][keys[wordKey]];
                    wordKey = wordKey ? 0 : 1;
                }
            );
            this.el.querySelectorAll('audio')[0].src = this.list[this.key].sound;
        }
        
        timer()
        {
            this._timer = setInterval(
                () =>
                {
                    this.setNext();
                },
                4000
            );
        }
        
        bind()
        {
            this.el.onmouseover = () =>
            {
                if (this._timer) clearInterval(this._timer);
            };
            
            this.el.onmouseout = () =>
            {
                this.timer();
            };
            
            this.el.onclick = () =>
            {
                this.el.querySelectorAll('audio')[0].play();
            };
        }
        
        init(list)
        {
            this.list = list;
            this.setNext();
            this.timer();
            this.bind();
        }
    }
    
    let core  = new Core();
    let label = new Label(
        el =>
        {
            document.body.appendChild(el);
        }
    );
    
    chrome.extension.sendMessage(
        {type: 'learn_list'},
        list =>
        {
            
            core.init(list);
            label.init(list);
        }
    );
    
    
    /* Events
     ================================================== */
    
    document.ondblclick = function ()
    {
        let selection = window.getSelection().toString();
        
        if (selection)
        {
            chrome.runtime.sendMessage({type: 'translate', text: selection});
        }
    };
    
})();