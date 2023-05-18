// Creating a DevTools panel
chrome.devtools.panels.create("LoopNet", "../icons/cs_32.png", "panel/loopnet_panel.html", panel => {
    panel.onShown.addListener( (extPanelWindow) => {
        RenderTraceTab(extPanelWindow);
        RenderHeadersTab(extPanelWindow);
    });
});

function RenderTraceTab(extPanelWindow) {
    let dateNowData = extPanelWindow.document.querySelector('#traceFrame').contentDocument.querySelector('#dateNowData');
    const date = new Date();
    const dateString = date.toISOString()
    dateNowData.innerHTML = dateString;
}
function RenderHeadersTab(extPanelWindow) {
    let dateNowData = extPanelWindow.document.querySelector('#headersFrame').contentDocument.querySelector('#dateTimeNowData');
    const date = new Date();
    const dateString = date.toLocaleDateString();
    dateNowData.innerHTML = dateString;
}

/*setInterval(async() => {
    if (count > 3) {
        chrome.storage.local.set({ key: Date.now() });
    }

    chrome.storage.local.get(["key"]).then((result) => {
        storageData.innerHTML = result.key;
    });

    count = count + 1;
    countStr.innerHTML = count;
    try {
        const apiResponse = await axios.get(`${api}`);
        response.innerHTML = apiResponse.data.title;

      } catch (error) {
        response.innerHTML = "We have no data for the country you have requested.";
      }

}, 3000);*/
