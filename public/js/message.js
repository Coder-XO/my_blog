$(function ($) {
    $('#face-btn').SinaEmotion($('#messageBox'));
    $('#commit').click(function () {    // 提交评论事件
        if ($('#messageBox').val().trim() === '') {
            alert('评论不能为空!')
            return undefined
        } else {

            let content = AnalyticEmotion($('#messageBox').val().trim())
            let currentTime = new Date().toISOString()
            let pubTime = currentTime.substring(0, currentTime.indexOf('T'))
            let id = $('#idCon').text()
            // 插入文章评论
            $.post('/insertCom', {content: content, pubTime: pubTime, id: id}, function (data) {
                console.log(data)
                if (data === '成功!') {
                    $.get('/getCom', {id: id}, function (data) {
                        let htmlStr = ``
                        data.forEach(function (item) {
                            console.log(item.content)
                            console.log(AnalyticEmotion(item.content));
                            htmlStr += ` <li class="clearfix">
            <div class="header fl">
                <img src="./public/img/head/1.jpg" alt="">
            </div>
            <div class="content fr">
                <h4>${item.username}</h4>
                <p>${AnalyticEmotion(item.content)}</p>
            </div>
            <div class="message-footer">
                <p>${item.comTime}</p>
            </div>
        </li>`
                        })
                        $('.show-message-list ul').html(htmlStr)
                    })
                    $('.show-message-list ul').append(reply(AnalyticEmotion($('#messageBox').val().trim())));
                    $('#messageBox').val('')
                } else {
                    if (data === '请登录!') {
                        location.href = '/login'
                    }
                }
            })
        }
    });

    function reply(content) {
        let currentTime = new Date().toISOString()
        let pubTime = currentTime.substring(0, currentTime.indexOf('T'))
        var html = `
        <li class="clearfix">
            <div class="header fl">
                <img src="./public/img/head/1.jpg" alt="">
            </div>
            <div class="content fr">
                <h4>阿加西</h4>
                <p>${content}</p>
            </div>
            <div class="message-footer">
                <p>${pubTime}</p>
            </div>
        </li>`
        return html;
    }

    // 请求该文章的评论
    let id = $('#idCon').text()
    $.get('/getCom', {id: id}, function (data) {
        console.log(data)
        let htmlStr = ``
        if (data !== '未找到!') {
            data.forEach(function (item) {
                console.log(item.content)
                console.log(AnalyticEmotion(item.content));
                htmlStr += ` <li class="clearfix">
            <div class="header fl">
                <img src="./public/img/head/1.jpg" alt="">
            </div>
            <div class="content fr">
                <h4>${item.username}</h4>
                <p>${AnalyticEmotion(item.content)}</p>
            </div>
            <div class="message-footer">
                <p>${item.comTime}</p>
            </div>
        </li>`
            })
            $('.show-message-list ul').html(htmlStr)
        } else {
            return undefined
        }
    })
})
