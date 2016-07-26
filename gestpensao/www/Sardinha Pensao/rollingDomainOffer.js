$(function () {
    var liItems = $('li.removeifnorollingoffer');

    if (liItems.length > 0) {
        liItems.remove();
    } else {
        var vt = $('#VTickerList');
        if (vt.length > 0) {
            $('#VTickerList').vTicker({
                speed: 300,
                pause: 10000,
                animation: 'fade',
                mousePause: true,
                showItems: 1
            });
        }
    }
});