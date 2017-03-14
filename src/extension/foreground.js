"use strict";

(function ()
{
    console.log('Run');
    
    class Html {
        constructor()
        {
            
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
        
        label(cb)
        {
            this.get(
                '/html/label.html', html =>
                {
                    let div = document.createElement('div');
                    div.classList.add('gold10_label');
                    div.innerHTML = html;
                    cb(div);
                }
            );
        }
        
        tooltip(cb)
        {
            this.get(
                '/html/tooltip.html', html =>
                {
                    let div = document.createElement('div');
                    div.classList.add('gold10_tooltip');
                    div.innerHTML = html;
                    cb(div);
                }
            );
        }
    }
    
    let html   = new Html();
    
    chrome.extension.sendMessage(
        {type: 'learn_list'},
        list =>
        {
            console.log(list);
        }
    );
    
    
    html.label(
        el =>
        {
            document.body.appendChild(el);
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