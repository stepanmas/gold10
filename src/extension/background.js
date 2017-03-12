chrome.tabs.onUpdated.addListener(
    function (tabId)
    {
        chrome.tabs.executeScript(
            tabId,
            {file: "foreground.js"}
        );
    }
);

chrome.runtime.onMessage.addListener(
    function (r, data)
    {
        if (r.type === 'translate')
        {
            console.log(r.text);
        }
    }
);