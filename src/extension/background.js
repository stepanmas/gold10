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
        console.log(r);
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
                    sendResponse(user);
                }
            );
        }
        
        else if (r.type === 'learn_list')
        {
            socket.emit(
                'learn',
                {key: localStorage.getItem('gold10_key'), email: localStorage.getItem('gold10_email')}
            );
    
            socket.off('learn');
            socket.on(
                'learn', l =>
                {
                    sendResponse(l);
                }
            );
        }
        
        return true;
    }
);