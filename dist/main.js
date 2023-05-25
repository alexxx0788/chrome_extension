import Helper from "./static/js/helper.js";
import HtmlHelper from "./static/js/htmlHelper.js";
import FeatureToggleHelper from "./static/js/featureToggleHelper.js";

const PanelName = 'LoopNet';
const PanelPath = 'devtools.html';
const HeadersStorageKey = 'RequestHeaders';
const HeadersContainerId = '#headersContainer';
const SelectedHeadersContainerId = '#selectedHeaders';
const TotalHeadersContainerId = '#totalHeaders';
const HeaderAddButtonId = '#headerAddBtn';
const HeaderNameInpId = '#headerNameInp';
const HeaderValueInpId = '#headerValueInp';
const HeaderCheckBoxId = '#headerNameChBx';
const DeleteAllBtnId = '#deleteAllBtn';
let PanelWindow;
let featureToggles = [];

// Creating a DevTools panel
chrome.devtools.panels.create(PanelName, "../icons/cs_32.png", PanelPath, panel => {
    panel.onShown.addListener( (extPanelWindow) => {
        PanelWindow = extPanelWindow;
        //chrome.storage.local.set({ RequestHeaders: '' }); //to delete
        showFeatureTogglesList();
        showHeadersListAsync();
        registerEventListeners();
    });
});

function registerHeaderOnChangeEvents() {
    let headerFields = PanelWindow.document.querySelectorAll('.header-field-change');
    let headerDeleteBtns = PanelWindow.document.querySelectorAll('.header-delete');
    headerFields.forEach(function(h) {
        h.addEventListener("change", () => updateHeadersDataAsync());
    });
    headerDeleteBtns.forEach(function(element) {
        element.addEventListener("click", () => deleteHeaderAsync(element));
    });
}

function registerEventListeners()
{
    PanelWindow.document.querySelector(HeaderAddButtonId).addEventListener("click", () => addHeaderFromInputAsync());
    PanelWindow.document.querySelector(HeaderCheckBoxId).addEventListener("change", () => setAllHeadersActiveAsync());
    PanelWindow.document.querySelector(DeleteAllBtnId).addEventListener("click", () => deleteAllHeadersAsync());
    PanelWindow.document.querySelector(HeaderNameInpId).addEventListener("input", () => autoCompleteFeatureToggles());
}

function autoCompleteFeatureToggles() {
    const input = PanelWindow.document.querySelector(HeaderNameInpId);
    const inputValue = PanelWindow.document.querySelector(HeaderNameInpId).value.toLowerCase();
    const filteredSuggestions = featureToggles.filter(ft =>
        ft.toLowerCase().includes(inputValue)
    );

    // Clear previous suggestions
    clearSuggestions();

    // Display new suggestions
    filteredSuggestions.forEach(suggestion => {
    const suggestionElement = document.createElement('div');
    suggestionElement.textContent = suggestion;
    suggestionElement.classList.add('suggestion');
    suggestionElement.addEventListener('click', function() {
        input.value = suggestion;
        clearSuggestions();
    });
    input.parentNode.appendChild(suggestionElement);
    });
}

function clearSuggestions() {
    const suggestionElements = PanelWindow.document.querySelectorAll('.suggestion');
    suggestionElements.forEach(element => element.remove());
}

async function updateHeadersDataAsync() {
    let headerStatuses = PanelWindow.document.querySelectorAll('.header-status');
    let headerNames = PanelWindow.document.querySelectorAll('.header-name');
    let headerValues = PanelWindow.document.querySelectorAll('.header-value');
    let headers = [];
    for (let i = 0; i < headerStatuses.length; i++) {
        headers.push({name : headerNames[i].value, value: headerValues[i].value, active: headerStatuses[i].checked});
    }
    HtmlHelper.renderHtml(PanelWindow, SelectedHeadersContainerId, headers.filter(h=>h.active).length);
    HtmlHelper.renderHtml(PanelWindow, TotalHeadersContainerId, headers.length);
    await chrome.storage.local.set({ RequestHeaders: headers });
    await showHeadersListAsync(PanelWindow);
}

async function deleteHeaderAsync(element) {
    let headerName = element.getAttribute('headerName');
    let headers = [];
    await chrome.storage.local.get([HeadersStorageKey]).then((result) => {
        if ( result.RequestHeaders !== undefined && result.RequestHeaders !== '') {
            headers = result.RequestHeaders;
        }
    });
    await chrome.storage.local.set({ RequestHeaders: headers.filter(h => h.name !== headerName) });
    await showHeadersListAsync(PanelWindow);
}

async function showHeadersListAsync() {
    await chrome.storage.local.get([HeadersStorageKey]).then((result) => {
        if (!Helper.isObjectUndefinedOrEmpty(result.RequestHeaders)) {
            let html = '';
            result.RequestHeaders.forEach(function(header) {
                html += HtmlHelper.renderHeaderRow(header.name, header.value, header.active)
            });
            HtmlHelper.renderHtml(PanelWindow, HeadersContainerId, html);
            HtmlHelper.renderHtml(PanelWindow, SelectedHeadersContainerId, result.RequestHeaders.filter(h=>h.active).length);
            HtmlHelper.renderHtml(PanelWindow, TotalHeadersContainerId, result.RequestHeaders.length);
            registerHeaderOnChangeEvents();
        }
    });

}

async function addHeaderFromInputAsync() {
    let inputheaderName = PanelWindow.document.querySelector(HeaderNameInpId).value;
    let inputheaderValue = PanelWindow.document.querySelector(HeaderValueInpId).value;
    let headers = [];
    await chrome.storage.local.get([HeadersStorageKey]).then((result) => {
        if ( result.RequestHeaders !== undefined && result.RequestHeaders !== '') {
            headers = result.RequestHeaders;
        }
    });
    if (!Helper.isObjectEmpty(inputheaderName) && headers.find(h => h.name === inputheaderName) === undefined) {
        headers.push({name : inputheaderName, value: inputheaderValue, active: true});
        await chrome.storage.local.set({ RequestHeaders: headers });
        await showHeadersListAsync(PanelWindow);
    } else {
        HtmlHelper.showError(PanelWindow, 'Header Name is empty or already added.')
    }

    PanelWindow.document.querySelector(HeaderNameInpId).value = '';
    PanelWindow.document.querySelector(HeaderValueInpId).value = '';
}

async function setAllHeadersActiveAsync() {
    let activeStatus = PanelWindow.document.querySelector(HeaderCheckBoxId).checked;
    let headers = [];
    await chrome.storage.local.get([HeadersStorageKey]).then((result) => {
        if ( result.RequestHeaders !== undefined && result.RequestHeaders !== '') {
            headers = result.RequestHeaders;
        }
    });
    for(let i=0; i< headers.length; i++) {
        headers[i].active = activeStatus;
    }
    await chrome.storage.local.set({ RequestHeaders: headers });
    await showHeadersListAsync(PanelWindow);
}

async function deleteAllHeadersAsync() {
    await chrome.storage.local.set({ RequestHeaders: [] });
        await showHeadersListAsync(PanelWindow);
}

async function showFeatureTogglesList(extPanelWindow, searchWord) {
    await FeatureToggleHelper.getFeatureTogglesAsync(extPanelWindow).then((data) => {
        featureToggles = data;
        /*let html = '';
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
        });*/
    });
}




