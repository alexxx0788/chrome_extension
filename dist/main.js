const featuresServiceUrl = 'https://ocobondarenko.dev.loopnet.com/services/features/pull'; // features url
const featuresServiceHeaderValue = '170cf7e5-667a-49a4-a630-227d6e85daa0';


// Creating a DevTools panel
chrome.devtools.panels.create("LoopNet", "../icons/cs_32.png", "panel/devtools.html", panel => {
    panel.onShown.addListener( (extPanelWindow) => {
       // RenderHeadersTab(extPanelWindow);
          renderFeaturesList(extPanelWindow);
    });
});

async function fetchFeaturesAsync(extPanelWindow) {
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-FMS-Token' : featuresServiceHeaderValue 
      }
    };
    
    try {
      const response = await fetch(featuresServiceUrl, options);
      const data = await response.json();
      let featuresObj = JSON.parse(data.FeaturesJson);
      return featuresObj.Apps[0].Features;
    } catch (error) {
        let errorBlock = extPanelWindow.document.querySelector('#error-block');
        //errorBlock.innerHTML = JSON.stringify(error);
    }
}

async function renderFeaturesList(extPanelWindow) {
    let html = '';
    let featuresList = await fetchFeaturesAsync(extPanelWindow);
    for(let i=0;i<featuresList.length;i++) {
        html += '<li>'+ featuresList[i].NameId+'</li>'
    }
    let headersCont = extPanelWindow.document.querySelector('#modRequestFrame').contentDocument.querySelector('#headersCont');
    headersCont.innerHTML = html;
}



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

