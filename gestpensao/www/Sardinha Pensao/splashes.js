$(function () {

    var $dialog = $('[data-type="dialog"]');

    var $mpd = $('[data-type="dialog"]');
    var $mpbd = $('[data-type="backdrop"]');
    var $mpbuttonclose = $('[data-type="cancel"]');
    var $mpbuttoncloseaftertrial = $('[data-type="cancelaftertrial"]');
    var $mpbuttonu1 = $('[data-type="upgrade1"]');
    var $mpbuttonu2 = $('[data-type="upgrade2"]');
    var $mpbuttonu3 = $('[data-type="upgrade3"]');
    var $mpbuttonu4 = $('[data-type="upgrade4"]');
    var $mpbuttonue = $('[data-type="upgradee"]');
    var $mpbuttonupgradeaftertrial = $('[data-type="upgradeaftertrial"]');
    
    $dialog.modalpro();

    $dialog.on('cancel', function () {
        if ($mpbuttoncloseaftertrial) {
            window.SplashesTracker.track("CancelAfterTrial", { "CancelAfterTrial": "1" });
        }
    });

    $mpbuttoncloseaftertrial.on("click", function () {
        $dialog.modalpro('close');
        window.SplashesTracker.track("CancelAfterTrial", { "CancelAfterTrial": "1" });
    });

    $mpbuttonupgradeaftertrial.on("click", function () {
        $dialog.modalpro('close');
        window.SplashesTracker.track("UpgradeAfterTrial", { "UpgradeAfterTrial": "1" });
    });

    $mpbuttonu1.on("click", function () {
        $dialog.modalpro('close');
        window.SplashesTracker.track("Login1Upgrade", { "Login1Upgrade": "1" });
    });

    $mpbuttonu2.on("click", function () {
        $dialog.modalpro('close');
        window.SplashesTracker.track("Login2Upgrade", { "Login2Upgrade": "1" });
    });

    $mpbuttonu3.on("click", function () {
        $dialog.modalpro('close');
        window.SplashesTracker.track("Login3Upgrade", { "Login3Upgrade": "1" });
    });

    $mpbuttonu4.on("click", function () {
        $dialog.modalpro('close');
        window.SplashesTracker.track("Login4Upgrade", { "Login4Upgrade": "1" });
    });

    $mpbuttonue.on("click", function () {
        $dialog.modalpro('close');
        window.SplashesTracker.track("EditUpgrade", { "EditUpgrade": "1" });
    });
});