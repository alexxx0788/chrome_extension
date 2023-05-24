const featuresServiceUrl = 'https://ocobondarenko.dev.loopnet.com/services/features/pull'; // features url
const featuresServiceHeaderValue = '170cf7e5-667a-49a4-a630-227d6e85daa0';

// Creating a DevTools panel
chrome.devtools.panels.create("LoopNet", "../icons/cs_32.png", "panel/devtools.html", panel => {
    panel.onShown.addListener( (extPanelWindow) => {
       //chrome.storage.local.set({ p1Headers: '' });

       showHeadersList(extPanelWindow);
       showFeatureTogglesList(extPanelWindow);


       let featureToggleInput = extPanelWindow.document.querySelector('#modRequestFrame').contentDocument.querySelector('#featureToggleInput');
       let featureToggleReload = extPanelWindow.document.querySelector('#modRequestFrame').contentDocument.querySelector('#featureToggleReload');
       featureToggleInput.addEventListener("input", () => showFeatureTogglesList(extPanelWindow, window.event.target.value));
       featureToggleReload.addEventListener("click", () => showFeatureTogglesList(extPanelWindow, '', true));
    });
});



function showHeadersList(extPanelWindow) {
    chrome.storage.local.get(["p1Headers"]).then((result) => {
        let html = '';
        let headersContainer = extPanelWindow.document.querySelector('#modRequestFrame').contentDocument.querySelector('#headers-container');
        if (result.p1Headers !== undefined && result.p1Headers!='') {
            let headers = result.p1Headers;
            for (let i=0; i < headers.length; i++) {
                html += renderHeaderField(headers[i].name, headers[i].value)
            }
            headersContainer.innerHTML = html;
        }
    });
}

function renderHeaderField(headerName, headerValue) {
    return '<input class="headerName" value="'+ headerName +'" /> : <input class="headerValue" value="'+ headerValue +'" /><br/>';
}

async function fetchFeaturesAsync(extPanelWindow) {
    try {
        let features = [];
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
                featuresObj.Apps[0].Features.forEach(function(ft) {
                    features.push(ft.NameId);    
                });

                let featuresStr = features.join(',');
                chrome.storage.local.set({ featureToggles: featuresStr });
                
                return features;
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

async function showFeatureTogglesList(extPanelWindow, searchWord, reload) {
    let html = '';
    let featureTogglesList;

    await chrome.storage.local.get(["featureToggles"]).then((result) => {
        if (result.featureToggles !== undefined && result.featureToggles !== '') {
            featureTogglesList = result.featureToggles.split(',');
        }
    });

    if (featureTogglesList === undefined || reload !== undefined) {
        featureTogglesList = await fetchFeaturesAsync(extPanelWindow);
    }
     
    if (featureTogglesList !== undefined) {
        for(let i=0;i<featureTogglesList.length;i++) {
            let featureName = featureTogglesList[i];
            if (searchWord === '' || searchWord === undefined || featureName.toLowerCase().includes(searchWord.toLowerCase()))
            {
                html += '<div class="feature-toggle" val="'+ featureName +'">X-Feature-'+ featureName +'</div>'
            }
        }
        let featureTogglesCont = extPanelWindow.document.querySelector('#modRequestFrame').contentDocument.querySelector('#featureToggles-container');
        featureTogglesCont.innerHTML = html;

        let featureToggles = extPanelWindow.document.querySelector('#modRequestFrame').contentDocument.querySelectorAll('.feature-toggle');
        featureToggles.forEach(function(element) {
            element.addEventListener("click", () => AddHeader(extPanelWindow, element));
        });
    }
}

async function AddHeader(extPanelWindow, element) {
    let featureName = 'X-Feature-' + element.getAttribute('val');

    let headers = [];
    await chrome.storage.local.get(["p1Headers"]).then((result) => {
        if ( result.p1Headers !== undefined && result.p1Headers !== '') {
            headers = result.p1Headers;
        }
    });
    headers.push({name : featureName, value: 'True'});

    await chrome.storage.local.set({ p1Headers: headers });

    showHeadersList(extPanelWindow);
}

function showError(extPanelWindow, errorText) {
    let errorBlock = extPanelWindow.document.querySelector('#error-block');
    errorBlock.innerHTML = 'Error. ' + errorText;
}

