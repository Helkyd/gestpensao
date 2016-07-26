$(document).ready(function () {
    $("#rightbar-heading").click(function (e) {
        e.preventDefault();

        $('#rightbar').toggleClass("min");
    });
    if ($('#ifrmPreview').length) {
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
    } else {
    	$('.alert-domain').addClass('iframeLoaded');
		$('.alert-info').addClass('iframeLoaded');
		$('#rightbar').addClass('iframeLoaded');
		$('.setting-navigation').addClass('iframeLoaded');
		setTimeout(function(){
			$('#rightbar').addClass('clear');
		}, 1000);
    }
});