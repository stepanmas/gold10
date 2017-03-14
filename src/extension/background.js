chrome.tabs.onUpdated.addListener(
    function (tabId, info)
    {
        if (info.status == "complete")
        {
            chrome.tabs.executeScript(
                tabId,
                {file: "vendor/moment.js"}
            );
            
            chrome.tabs.executeScript(
                tabId,
                {file: "vendor/socket.io.min.js"}
            );
            
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