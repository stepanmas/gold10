chrome.tabs.onUpdated.addListener(
    function (tabId)
    {
        chrome.tabs.executeScript(
            tabId,
            {file: "foreground.js"}
        );
    }
);