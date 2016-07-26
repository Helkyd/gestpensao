(function($){
    $(function(){
        moment.lang($('html').attr("lang"));

        var pad = function(n, width, z){
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        },
        getCountdown = function(){
            var mExpiry = moment.duration(moment($('#hidDomainOfferTimeLeft').text()).diff(moment()));
            return pad(Math.floor(mExpiry.asHours()),2)+":"+pad(mExpiry.minutes(),2)+":"+pad(mExpiry.seconds(),2);
        },
        setCountdown = function(){
            if($('#hidDomainOfferTimeLeft').length > 0){
            $('.domain_offer_time_limit').html(getCountdown());
            }
        };
        setCountdown();
        setInterval(setCountdown, 1000);
    });
}(jQuery));