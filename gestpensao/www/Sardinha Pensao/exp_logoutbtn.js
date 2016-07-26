$(document).ready(function () {
    $('[data-purpose=logout-btn]').click(function() {
        $('.icon', $(this)).hide();
        $(this).prepend($('<i>').addClass('icon ion-load-c').addClass('spinner'));        
        var redir = $(this).attr('data-redirect');
        $.ajax({
            url: $(this).attr('data-target'),
            cache: false,
            type: 'POST',
            success: function (resData, status, jqxhr) {                
                window.location = redir;
            },
            error: function (err, status) {
                alert('Logout failed');
            }
        });
    });
});