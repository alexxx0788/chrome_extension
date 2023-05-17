const api = "https://jsonplaceholder.typicode.com/todos/1";

let response;
let storageData;
let count = 0;
let countStr;


chrome.devtools.panels.create("LoopNet Panel", "icon.ico", "devtools_panel.html", panel => {
    // code invoked on panel creation
    panel.onShown.addListener( (extPanelWindow) => {
        response = extPanelWindow.document.querySelector('#tab1Frame').contentDocument.querySelector('#response');
        storageData = extPanelWindow.document.querySelector('#tab1Frame').contentDocument.querySelector('#storageData');
        countStr = extPanelWindow.document.querySelector('#tab1Frame').contentDocument.querySelector('#count');
    });
});

setInterval(async() => {

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
}, 3000);
