$(function () {
    $('#search-btn').click(function () {
        $('#search-txt').toggle();
    });
    $('.nav-bar>.w>ul>li').mousemove(function () {
        $(this).children("ul").stop().show(300);
    })
    $('.nav-bar>.w>ul>li').mouseout(function () {
        $(this).children("ul").stop().hide(300);
    })
})
