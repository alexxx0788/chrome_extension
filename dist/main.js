const featuresServiceUrl = 'https://ocobondarenko.dev.loopnet.com/services/features/pull'; // features url
const featuresServiceHeaderValue = '170cf7e5-667a-49a4-a630-227d6e85daa0';

// Creating a DevTools panel
chrome.devtools.panels.create("LoopNet", "../icons/cs_32.png", "panel/devtools.html", panel => {
    panel.onShown.addListener( (extPanelWindow) => {
        showHeadersList(extPanelWindow);
        //showFeatureTogglesList(extPanelWindow);
    });
});

function showHeadersList(extPanelWindow) {

   /* let o = [
        {
            name : 'header1',
            value : 'value1'
        },
        {
            name : 'header2',
            value : 'value2'
        },
        {
            name : 'header3',
            value : 'value3'
        }
    ];

    chrome.storage.local.set({ p1Headers: o }).then(() => {
        console.log("Value is set to " + value);
      });*/

    chrome.storage.local.get(["p1Headers"]).then((result) => {
        let html = '';
        let headersContainer = extPanelWindow.document.querySelector('#modRequestFrame').contentDocument.querySelector('#headers-container');
        let headers = result.p1Headers;
        for (let i=0; i < headers.length; i++) {
            html += renderHeaderField(headers[i].name, headers[i].value)
        }
        headersContainer.innerHTML = html;
    });
}

function renderHeaderField(headerName, headerValue) {
    return '<input class="headerName" value="'+ headerName +'" /> : <input class="headerValue" value="'+ headerValue +'" /><br/>';
}

async function fetchFeaturesAsync(extPanelWindow) {
    try {
        const options = {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-FMS-Token' : featuresServiceHeaderValue 
            }
          };
        const response = await fetch(featuresServiceUrl, options);
        const responseData = await response.json();
        if (responseData !== undefined) {
            let featuresObj = JSON.parse(responseData.FeaturesJson);
            if (featuresObj !== undefined && 
                featuresObj.Apps !== undefined && 
                featuresObj.Apps.length > 0 && 
                featuresObj.Apps[0].Features !== undefined) {
                return featuresObj.Apps[0].Features;
            } else {
                showError(extPanelWindow, 'An error occurred feature toggles the data object.');
            }
        } else {
            showError(extPanelWindow, 'An error occurred on parsing feature toggles data.');
        }
        
    } catch (error) {
        showError(extPanelWindow, 'An error occurred on feature toggles pull.');
    }
    return undefined;
}

async function showFeatureTogglesList(extPanelWindow) {
    let html = '';
    let featuresList = await fetchFeaturesAsync(extPanelWindow);
    if (featuresList !== undefined) {
        for(let i=0;i<featuresList.length;i++) {
            html += '<div class="feature-toggle">X-Feature-'+ featuresList[i].NameId+'</div>'
        }
        let featureTogglesCont = extPanelWindow.document.querySelector('#modRequestFrame').contentDocument.querySelector('#featureToggles-container');
        featureTogglesCont.innerHTML = html;
    }
}


function showError(extPanelWindow, errorText) {
    let errorBlock = extPanelWindow.document.querySelector('#error-block');
    errorBlock.innerHTML = 'Error. ' + errorText;
}

