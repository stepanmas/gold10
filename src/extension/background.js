const VOICETIMEOUT = [5, 'minute'];

self.params = {
    server   : 'https://gold10.stepanmas.com',
    io_params: {
        'path': '/socket.io'
    }
};

function IO()
{
    if (!self.socket)
        self.socket = io.connect(
            self.params.server,
            self.params.io_params
        );
    
    return self.socket;
}

chrome.tabs.onUpdated.addListener(
    function (tabId, info)
    {
        if (info.status === "complete")
        {
            chrome.tabs.executeScript(
                tabId,
                {file: "foreground.js"}
            );
            
            chrome.tabs.insertCSS(
                tabId,
                {file: "styles.css"}
            );
        }
    }
);

chrome.extension.onMessage.addListener(
    function (r, sender, sendResponse)
    {
        if (r.type === 'auth')
        {
            IO().emit(
                'signin',
                r
            );
    
            IO().off('signed');
            IO().on(
                'signed', user =>
                {
                    localStorage.setItem('gold10_key', user.key);
                    localStorage.setItem('gold10_email', user.email);
                    sendResponse(user);
                }
            );
        }
        
        else if (r.type === 'learn_list')
        {
            var cache = localStorage.getItem('gold10_learn_list');
            
            if (cache) cache = JSON.parse(cache);
            
            if (cache && cache.day === moment().format('YYYY-MM-DD'))
            {
                sendResponse(cache.list);
                return true;
            }
    
            IO().emit(
                'learn',
                {key: localStorage.getItem('gold10_key'), email: localStorage.getItem('gold10_email')}
            );
    
            IO().off('learn');
            IO().on(
                'learn', l =>
                {
                    localStorage.setItem(
                        'gold10_learn_list',
                        JSON.stringify(
                            {
                                day : moment().format('YYYY-MM-DD'),
                                list: l
                            }
                        )
                    );
                    sendResponse(l);
                }
            );
        }
        else if (r.type === 'cache_reset')
        {
            localStorage.removeItem('gold10_learn_list');
        }

        else if (r.type === 'voice')
        {
            let nextRun = moment().add(VOICETIMEOUT[0], VOICETIMEOUT[1]).format();

            if (!localStorage.getItem('voice')) localStorage.setItem('voice', nextRun);

            let voice = localStorage.getItem('voice');

            if (moment().isAfter(voice))
            {
                localStorage.setItem('voice', nextRun);
                sendResponse(true);
            }
            else
            {
                sendResponse(false);
            }
        }
        
        return true;
    }
);