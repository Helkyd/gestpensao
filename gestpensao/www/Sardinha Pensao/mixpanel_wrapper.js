window.MIXPANELWRAPPER = function () {
    var _isMixpanelTrackingActive;
    return {
        init: function () {
            var externalEventDataLayer = [];
            var externalEventSuperProperties = [];
            if ($('#externalEventContainer').length > 0) {
                externalEventDataLayer = JSON.parse($('#externalEventContainer').text()) || [];
            }
            if ($('#externalEventSuperPropertiesContainer').length > 0) {
                externalEventSuperProperties = JSON.parse($('#externalEventSuperPropertiesContainer').text()) || [];
            }
            if (typeof MIXPANELEVENTS !== 'undefined' && typeof mixpanel !== "undefined" && typeof externalEventSuperProperties !== "undefined" && typeof externalEventDataLayer !== "undefined") {
                MIXPANELEVENTS.init(externalEventDataLayer, externalEventSuperProperties);
                _isMixpanelTrackingActive = true;
            }
            else { _isMixpanelTrackingActive = false;}
        },
        track: function(eventData) {
            if (_isMixpanelTrackingActive) {
                MIXPANELEVENTS.trackSingleEvent(eventData);
            }
        }
    }
}();

$(document).ready(function () {
    MIXPANELWRAPPER.init();  
});