import Helper from "./static/js/Helper.js";
import HtmlHelper from "./static/js/htmlHelper.js";
import FeatureToggleHelper from "./static/js/featureToggleHelper.js";

const PanelName = 'LoopNet';
const PanelPath = 'panel/devtools.html';
const HeadersStorageKey = 'RequestHeaders';
const HeadersContainerId = '#headers-container';
const SelectedHeadersContainerId = '#selectedHeaders';
const TotalHeadersContainerId = '#totalHeaders';

// Creating a DevTools panel
chrome.devtools.panels.create(PanelName, "../icons/cs_32.png", PanelPath, panel => {
    panel.onShown.addListener( (extPanelWindow) => {
       showHeadersList(extPanelWindow);
      // showFeatureTogglesList(extPanelWindow);

       /*let featureToggleInput = extPanelWindow.document.querySelector('#modRequestFrame').contentDocument.querySelector('#featureToggleInput');
       let featureToggleReload = extPanelWindow.document.querySelector('#modRequestFrame').contentDocument.querySelector('#featureToggleReload');
       featureToggleInput.addEventListener("input", () => showFeatureTogglesList(extPanelWindow, window.event.target.value));
       featureToggleReload.addEventListener("click", () => showFeatureTogglesList(extPanelWindow, '', true));*/
    });
});

function showHeadersList(extPanelWindow) {
    chrome.storage.local.get([HeadersStorageKey]).then((result) => {
        if (!Helper.isObjectUndefinedOrEmpty(result.RequestHeaders)) {
            let html = '';
            result.RequestHeaders.forEach(function(header) {
                html += HtmlHelper.renderHeaderRow(header.name, header.value)
            });
            HtmlHelper.renderHtml(extPanelWindow, HeadersContainerId, html);
            HtmlHelper.renderHtml(extPanelWindow, SelectedHeadersContainerId, result.RequestHeaders.length);
            HtmlHelper.renderHtml(extPanelWindow, TotalHeadersContainerId, result.RequestHeaders.length);
        }
    });

}

async function showFeatureTogglesList(extPanelWindow, searchWord) {

    await FeatureToggleHelper.getFeatureTogglesAsync(extPanelWindow).then((data) => {
        let html = '';
        for(let i=0;i < data.length;i++) {
            let featureName = data[i];
            if (searchWord === '' || searchWord === undefined || featureName.toLowerCase().includes(searchWord.toLowerCase()))
            {
                html += '<div class="feature-toggle" val="'+ featureName +'">'+ featureName +'</div>'
            }
        }
        let featureTogglesCont = extPanelWindow.document.querySelector('#featureToggles-container');
        featureTogglesCont.innerHTML = html;

        let featureToggles = extPanelWindow.document.querySelectorAll('.feature-toggle');
        featureToggles.forEach(function(element) {
            element.addEventListener("click", () => AddHeader(extPanelWindow, element));
        });
    });
}

async function AddHeader(extPanelWindow, element) {
    let featureName = element.getAttribute('val');

    let headers = [];
    await chrome.storage.local.get([HeadersStorageKey]).then((result) => {
        if ( result.RequestHeaders !== undefined && result.RequestHeaders !== '') {
            headers = result.RequestHeaders;
        }
    });
    headers.push({name : featureName, value: 'True'});

    await chrome.storage.local.set({ RequestHeaders: headers });

    showHeadersList(extPanelWindow);
}


