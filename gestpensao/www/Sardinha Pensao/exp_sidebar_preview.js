$.fn.isOnScreen = function(){

    var win = $(window);

    var viewport = {
        top : win.scrollTop(),
        left : win.scrollLeft()
    };
    viewport.right = viewport.left + win.width();
    viewport.bottom = viewport.top + win.height();

    var bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth();
    bounds.bottom = bounds.top + this.outerHeight();

    return {
        isVisible : (!(viewport.right <= bounds.left || viewport.left >= bounds.right || viewport.bottom <= bounds.top || viewport.top >= bounds.bottom)),
        bounds: bounds,
        viewport: viewport
    };

};

$(document).ready(function () {

    $topAlert = $("[data-top-alert]");
    $navigation = $(".setting-navigation");

    if ($topAlert.length === 0 && $navigation.length === 0) return;

    var viewport = $topAlert.isOnScreen().viewport;
    var topAlertHeight = $topAlert.outerHeight();

    if ($topAlert.length > 0) {
        $navigation.css("top",topAlertHeight - viewport.top);
    } else {
        $navigation.css("top",0);
    }

    $(window).scroll(function() {
        var viewport = $topAlert.isOnScreen().viewport;

        if ($topAlert.isOnScreen().isVisible) {
            $navigation.css("top",topAlertHeight - viewport.top);
        } else {
            $navigation.css("top",0);
        }
    });

    $('#ifrmPreview').load(function() {
        $('.alert-domain').addClass('iframeLoaded');
        $('.alert-info').addClass('iframeLoaded');
        $('.js-layout-main').addClass('iframeLoaded');
        $('#rightbar').addClass('iframeLoaded');
        $('.setting-navigation').addClass('iframeLoaded');

        setTimeout(function(){
            $('#rightbar').addClass('clear');
        }, 1000);
    });

});
