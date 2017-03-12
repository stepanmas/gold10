document.ondblclick = function ()
{
    let selection = window.getSelection().toString();
    
    if (selection)
    {
        chrome.runtime.sendMessage({type: 'translate', text: selection});
    }
};