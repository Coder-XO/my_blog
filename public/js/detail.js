$(function () {
    $("#sponsor-btn").click(function () {
        if (event.target == event.currentTarget) {
            $('.sponsor-qrcode').show(500);
        }
    });
    $('body').click(function () {
        if (event.target != $("#sponsor-btn")[0])
            $('.sponsor-qrcode').hide(500);
    })
})
