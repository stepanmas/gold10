const socket = io.connect(
    'https://gold10.stepanmas.com', {
        'path': '/socket.io'
    }
);

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
            socket.emit(
                'signin',
                r
            );
            
            socket.off('signed');
            socket.on(
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
            
            socket.emit(
                'learn',
                {key: localStorage.getItem('gold10_key'), email: localStorage.getItem('gold10_email')}
            );
            
            socket.off('learn');
            socket.on(
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
        
        return true;
    }
);