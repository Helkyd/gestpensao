$(document).ready(function () {

    var aniQueueName = 'fxModal';
    var editpageURL = '/builder/pages/editpagecontent.aspx';

    var populateNewPage = function (pageid) {
        $.ajax({
            url: editpageURL+'?pageid='+pageid,
            cache: false,
            success: function (resData, status) {
                showNewPage(pageid);
            },
            error: function (err, status) {
                alert('failed edit!');
                cleanUpModal();
            }
        });
    }

    var showNewPage = function (pageid) {
        if ($('#ifrmPreview').length > 0 && !$('#ss-exp-add-edit-direct').length > 0) {
            var previewPageUrl = $('#ifrmPreview').data('preview-url');
            $('#ifrmPreview').attr('src', previewPageUrl + '/' + pageid);
            $('#ifrmPreview').load(function (e) {
                $('.close-icon').removeClass('disabled');
                showPageCreationDone();
            });
        }
        else {
            document.location.href = editpageURL + '?pageid=' + pageid;
        }
    };

    var showPageCreationDone = function () {
        $('.add-page-floater').attr('data-state', 'done');
    }

    var cleanUpModal = function () {        
        $('.add-page-floater').modalpro('close');        
        $('.add-page-floater').attr('data-state', '');        
        $('.modal-footer').removeClass('nopages');
        $('.close-icon').removeClass('disabled');
    }


    $(document).on('click', 'a[data-purpose=add-page]:not(.disabled)', function () {        
        cleanUpModal(); //ensure that we show the correct first screen
        $('.add-page-floater').modalpro('show');        
        logToUserEventLog('ClickedAddPageButton');
        MIXPANELWRAPPER.track({ 'Name': 'FloaterBox:Click', 'Properties': { 'Click': 'Add page' } });
    });

    $('.close-icon', ('.add-page-floater')).click(function (e) {
        if(!$(this).hasClass('disabled')){
            cleanUpModal();
        }
    });
    
    $('.btn-cancel', ('.add-page-floater')).click(function () {
        cleanUpModal();
        MIXPANELWRAPPER.track({ 'Name': 'FloaterBox:Click', 'Properties': { 'Click': 'Cancel Add page' } });
    });

    $('.done-message.modal-btn', ('.add-page-floater')).click(function () {
        cleanUpModal();
        MIXPANELWRAPPER.track({ 'Name': 'FloaterBox:Click', 'Properties': { 'Click': 'GotIt Add page' } });
    });

    $('[template-item]').click(function(e)
    {
        var template = $(e.target).attr('for');
        if (template == undefined) {
            template = $(e.target).parent().attr('for')
        }
        var addPageURL = '/builder/pages/AddPage.aspx?preview=true&create_silently=1&pagepos=bottom&template=' + template;

        $('.add-page-floater').attr('data-state', 'waiting');
        $('.close-icon').addClass('disabled');
        $.ajax({
            url: addPageURL,
            cache: false,
            dataType: "json",
            success: function (resData, status) {

                if (resData.pageid == -1) {
                    $('.add-page-floater').attr('data-state', 'nopages');
                    if (!$('.addpage-nomorepages-content').hasClass("no-bottom"))
                        $('.modal-footer').addClass('nopages');
                        $('.close-icon').removeClass('disabled');
                    MIXPANELWRAPPER.track({ 'Name': 'FloaterBox:NoMorePages', 'Properties': { } });
                }
                else {
                    if ($('#ifrmPreview').length > 0) {
                        populateNewPage(resData.pageid);
                    }
                    else {
                        showNewPage(resData.pageid);
                    }
                    MIXPANELWRAPPER.track({ 'Name': 'FloaterBox:Add page', 'Properties': { 'Page': template } });
                }
            },
            error: function (err, status) {
                alert('failed!');
                cleanUpModal();
                MIXPANELWRAPPER.track({ 'Name': 'FloaterBox:Error', 'Properties': { 'Click': 'Add page' } });
            }
        });
    });    

    var logToUserEventLog = function (userEventName) {
        $.ajax({
            url: '/api/v3/builder/user_event_log',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 'userEventName': userEventName }),
            beforeSend: function (xhr) {
                xhr.setRequestHeader('X-XSRF-Token', document.getElementById('anti-forgery-token').value);
            }            
        });
    }
});
