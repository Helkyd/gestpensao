$(document).ready(function () {
    function disableLink(e) {
        // cancels the event
        e.preventDefault();

        return false;
    }
        
    function saveBtnDisable(btn) {
        if (!btn.hasClass('disabled')) {
            btn.toggleClass('disabled');
        }
        btn.bind('click', disableLink);
    }

    function saveBtnEnable(btn) {
        if (btn.hasClass('disabled')) {
            btn.toggleClass('disabled');
        }
        btn.unbind('click', disableLink);
    }

    var saveBtn = $('a[data-purpose=return]:not(.disabled)');

    if (!SimpleSite.Util.BrowserDetect.isIE()) {
        saveBtnDisable(saveBtn);
    }

    var editUrl = "/builder/pages/editpagecontent.aspx?pageid=";

    $('#ifrmPreview').load(function () {
        //$('#rightbar-body a').toggleClass('disabled');
        //$('#rightbar-body button').toggleClass('disabled');

        var iframe = $(this).contents();
        $("#ifrmWrapper").removeClass('loading');

        var iframeBody = iframe.find("body");

        if (!SimpleSite.Util.BrowserDetect.isIE()) {
            $("ul.nav li a", iframeBody).click(function () {
                saveBtnDisable(saveBtn);
            });
        }

        var iframeBody = $(document.getElementById('ifrmPreview').contentWindow.document.body);
        //var wrapperHeight = iframeBody.outerHeight();
        var wrapperHeight = document.getElementById('ifrmPreview').contentWindow.document.body.offsetHeight;
        if (wrapperHeight < $(window).innerHeight()) {
            $('#ifrmPreview').height($(window).innerHeight());
        } else {
            $('#ifrmPreview').height(wrapperHeight + 200);
        }

        var pageIdRegEx = /view\/(\d+)(\/category|$)/g;
        var iframe_pathname = this.contentWindow.location.pathname;
        var pageIdArray = pageIdRegEx.exec(iframe_pathname);
        var iframe_pid = "0";
        if (pageIdArray.length > 1)
            iframe_pid = pageIdArray[1];
        //var iframe_pid = iframe_pathname.substr(iframe_pathname.lastIndexOf('/') + 1);
        //if (iframeBody.attr('data-pid') == 'undefined' || iframeBody.attr('data-pid') == null) { location.reload(); } else {
        //    saveBtn.attr('href', editUrl + iframeBody.attr('data-pid'));
        //}
        //if (iframeBody.attr('data-pid') == 'undefined' || iframeBody.attr('data-pid') == null) { location.reload(); } else {
        if (isInt(iframe_pid)) {
            saveBtn.attr('href', editUrl + iframe_pid);
            if (!SimpleSite.Util.BrowserDetect.isIE()) {
                saveBtnEnable(saveBtn);
            }
            $(this).attr('data-pid', iframe_pid);
        }

        clearInterval(this.interval);
        //this.interval = setInterval(function(){
        //    iframe.find('.share-box a').click(function (e) {
        //        e.preventDefault();
        //        e.stopPropagation();
        //     });
        //}, 1000);
        //iframe.click(function (e) {
          
        //});
    });

    function isInt(value) {
        return !isNaN(value) && 
               parseInt(Number(value)) == value && 
               !isNaN(parseInt(value, 10));
    }
});
