class Auth {
    constructor()
    {
        
    }
}

chrome.runtime.sendMessage({type: 'authentication'});

document.forms.auth.onsubmit = function ()
{
    
    console.log(document.forms.auth.username.value);
    return false;
};

if (!localStorage.getItem('gold10_key'))
{
    document.getElementById('authBox').style.display = 'block';
    document.getElementById('site').style.display    = 'none';
}
else
{
    document.getElementById('authBox').style.display = 'none';
    document.getElementById('site').style.display    = 'block';
}


chrome.runtime.onMessage.addListener(
    function (r, data)
    {
        if (r.type === 'translate')
        {
            let newPage = 'https://gold10.stepanmas.com/#!/add?word=' + r.text;
            let frame   = document.getElementById('site');
            let f       = document.createElement('iframe');
            
            f.id           = "site";
            f.style.width  = "800px";
            f.style.height = "600px";
            f.src          = newPage;
            
            frame.parentNode.removeChild(frame);
            
            document.body.appendChild(f);
        }
    }
);