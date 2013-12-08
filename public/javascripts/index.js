$(document).ready(function() {
    var $newPinForm = $('#new-pin-form');
    var $newPin = $('#new-pin');
    var $urlInput = $('#url-input');
    $newPin.click(function(e) {
        $newPinForm.removeClass('hidden').addClass('show');
        $(this).addClass('hidden');
        $urlInput.focus();
        e.preventDefault();
    });

});