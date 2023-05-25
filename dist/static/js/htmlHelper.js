export function showError(extPanelWindow, errorText) {
    const errorBlockId = '#errorBlock';
    let errorBlock = extPanelWindow.document.querySelector(errorBlockId);
    if (errorBlock !== null) {
        errorBlock.innerHTML = 'Error. ' + errorText;
    }
}

export function showLoader(extPanelWindow, containerId) {
    let container = extPanelWindow.document.querySelector(containerId);
    container.innerHTML = '<img class="loading-bar" src="../../static/images/loading.gif" />';
}

export function renderHeaderRow(headerName, headerValue, headerActive) {
    let checked = headerActive === true ? 'checked' : '';
    return '<input class="header-field-change header-status" type="checkbox" '+ checked +' />'+
    '<input class="header-field-change header-name" value="'+ headerName +'" /> : '+
    '<input class="header-field-change header-value" value="'+ headerValue +'" />' +
    '<input class="header-delete" headerName="'+ headerName +'" type="button" value="X" /><br/>';
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