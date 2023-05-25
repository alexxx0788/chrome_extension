import htmlHelper from "./htmlHelper.js";
import Helper from "./helper.js";

const featureTogglesStorageKey = 'featureToggles';
const featuresServiceUrl = 'https://ocobondarenko.dev.loopnet.com/services/features/pull'; // features url
const featuresServiceHeaderValue = '170cf7e5-667a-49a4-a630-227d6e85daa0';

export async function getFeatureTogglesAsync(extPanelWindow) {
    let featureTogglesList;
    await chrome.storage.local.get([featureTogglesStorageKey]).then((result) => {
        if (!Helper.isObjectUndefinedOrEmpty(result.featureToggles)) {
            featureTogglesList = result.featureToggles.split(',');
        }
    });
    if (Helper.isObjectUndefinedOrEmpty(featureTogglesList)) {
        featureTogglesList = await fetchFeaturesTogglesAsync(extPanelWindow);
    }
    return featureTogglesList;
}

async function fetchFeaturesTogglesAsync(extPanelWindow) {
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
        if (!Helper.isObjectUndefinedOrEmpty(responseData)) {
            let featuresObj = JSON.parse(responseData.FeaturesJson);
            if (featuresObj !== undefined && 
                featuresObj.Apps !== undefined && 
                featuresObj.Apps.length > 0 && 
                featuresObj.Apps[0].Features !== undefined) {
                featuresObj.Apps[0].Features.forEach(function(ft) {
                    features.push('X-Feature-' + ft.NameId);    
                });

                let featuresStr = features.join(',');
                chrome.storage.local.set({ featureToggles: featuresStr });                
                return features;
            } else {
                htmlRenderer.showError(extPanelWindow, 'An error occurred feature toggles the data object.');
            }
        } else {
            htmlHelper.showError(extPanelWindow, 'An error occurred on parsing feature toggles data.');
        }        
    } catch (error) {
        htmlHelper.showError(extPanelWindow, 'An error occurred on feature toggles pull.');
    }
    return undefined;
}

export default {
    getFeatureTogglesAsync
}