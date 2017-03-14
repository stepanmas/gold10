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

chrome.runtime.onMessage.addListener(
    function (r, tab)
    {
        if (r.type === 'authentication')
        {
    
            let socket = io.connect('https://gold10.stepanmas.com', {
                    'path': '/socket.io'
                }
            );
    
            socket.emit(
                'learn',
                {key: 'T26FglU5c2c67e3a58a4a87c6d399f8b38c80ae0c', username: 'stepan.mas.work@gmail.com'}
            );
            socket.on(
                'learn', l =>
                {
                    console.log(l);
                }
            );
            
        }
    }
);