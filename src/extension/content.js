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
                    document.getElementById('error').style.display = 'none';
                    document.getElementById('site').style.display  = 'block';
                    localStorage.setItem('gold10_key', user.key);
                    localStorage.setItem('gold10_email', user.email);
                }
                else
                {
                    document.getElementById('error').style.display = 'block';
                    document.getElementById('error').textContent   = error.error;
                }
                
            }
        );
    }
    else
    {
        document.getElementById('error').style.display = 'block';
        document.getElementById('error').textContent   = 'Need to fill all fields';
    }
    
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