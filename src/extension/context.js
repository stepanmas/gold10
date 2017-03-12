chrome.runtime.onMessage.addListener(
    function (r, data)
    {
        if (r.type === 'translate')
        {
            let newPage = 'https://gold10.stepanmas.com/#!/add?word=' + r.text;
            let frame = document.getElementById('site');
            let f            = document.createElement('iframe');
            
            f.id             = "site";
            f.style.width    = "800px";
            f.style.height   = "600px";
            f.src            = newPage;
    
            frame.parentNode.removeChild(frame);
            
            document.body.appendChild(f);
        }
    }
);