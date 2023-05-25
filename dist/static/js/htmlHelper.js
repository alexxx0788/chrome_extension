const errorBlockId = '#error-block';

export function showError(extPanelWindow, errorText) {
    let errorBlock = extPanelWindow.document.querySelector(errorBlockId);
    if (errorBlock !== null) {
        errorBlock.innerHTML = 'Error. ' + errorText;
    }
}

export function showLoader(extPanelWindow, containerId) {
    let container = extPanelWindow.document.querySelector(containerId);
    container.innerHTML = '<img class="loading-bar" src="../../static/images/loading.gif" />';
}

export function renderHeaderRow(headerName, headerValue) {
    return '<input class="headerField" value="'+ headerName +'" /> : <input class="headerField" value="'+ headerValue +'" /><br/>';
}

export function renderHtml(extPanelWindow, elementId, html) {
    extPanelWindow.document.querySelector(elementId).innerHTML = html;
}


export default {
    showError,
    showLoader,
    renderHeaderRow,
    renderHtml
}