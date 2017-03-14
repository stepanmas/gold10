function id(id)
{
    return document.getElementById(id);
}

document.forms.auth.onsubmit = function ()
{
    if (document.forms.auth.email.value && document.forms.auth.password.value)
    {
        chrome.extension.sendMessage(
            {
                type    : 'auth',
                email: document.forms.auth.email.value,
                password: document.forms.auth.password.value
            },
            (user, error) =>
            {
                if (!error && !error.error)
                {
                    id('error').style.display = 'none';
                    id('site').style.display  = 'block';
                    localStorage.setItem('gold10_key', user.key);
                    localStorage.setItem('gold10_email', user.email);
                }
                else
                {
                    id('error').style.display = 'block';
                    id('error').textContent   = error.error;
                }
                
            }
        );
    }
    else
    {
        id('error').style.display = 'block';
        id('error').textContent   = 'Need to fill all fields';
    }
    
    return false;
};

if (!localStorage.getItem('gold10_key'))
{
    id('authBox').style.display = 'block';
    id('site').style.display    = 'none';
}
else
{
    id('authBox').style.display = 'none';
    id('site').style.display    = 'block';
}