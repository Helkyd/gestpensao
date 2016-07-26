function IframeSignedOutHandler() {

    this.$previewIframe = null;

    this.init = function () {
        // Look for preview iframe
        this.$previewIframe = this.findPreviewIframe();

        // If found...
        if (this.$previewIframe !== null) {
            // ... attach event listener to load event
            var self = this;
            this.$previewIframe[0].onload = function () {
                self.handleIframeLoaded.call(self);
            };
        }
    };

    // Looks for preview iframe in markup.
    this.findPreviewIframe = function () {
        var $previewIframe = $('#ifrmPreview');
        if ($previewIframe.length > 0) {
            return $previewIframe;
        }

        return null;
    };

    // When iframe is loaded checks if it shows login screen. If it does - reloads the main window
    this.handleIframeLoaded = function () {
        if (this.iframeShowsLoginScreen()) {
            this.reloadMainWindow();
        }
    };

    // Looks for login form in markup in iframe contents
    this.iframeShowsLoginScreen = function () {
        var showsLoginScreen = this.$previewIframe.contents().find('form[action^="service-login.aspx"]').length > 0;
        return showsLoginScreen;
    };

    // Reloads the main window which redirects the user to the login screen in that window
    this.reloadMainWindow = function () {
        window.location.reload();
    };
}

$(function () {
    var iframeSignedOutHandler = new IframeSignedOutHandler();
    iframeSignedOutHandler.init();
});