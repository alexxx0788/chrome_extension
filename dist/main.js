// Creating a DevTools panel
chrome.devtools.panels.create("LoopNet", "../icons/cs_32.png", "panel/devtools.html", panel => {
    panel.onShown.addListener( (extPanelWindow) => {
        RenderHeadersTab(extPanelWindow);
    });
});

function RenderHeadersTab(extPanelWindow) {
    let p1HeadersObj;
    chrome.storage.local.get(["key"]).then((result) => {
        p1HeadersObj = JSON.parse(result.key).p1Headers;
        console.log(p1HeadersObj);
    });

    let headersCont = extPanelWindow.document.querySelector('#modRequestFrame').contentDocument.querySelector('#headersCont');
    let html = '';
    for(let i = 0; i < p1HeadersObj; i++) {
        html += p1HeadersObj[i].header;
        //RenderHeaderFields(p1HeadersObj[i].header, p1HeadersObj[i].value);
    }
    headersCont.innerHTML = html;
}

function RenderHeaderFields(headerName, headerValue) {
    return '<input class="headerName" value="'+ headerName +'" /> : <input class="headerValue" value="'+ headerValue +'" /><br/>';
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
