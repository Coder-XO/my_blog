$(function () {
    // 请求用户名
    let username = ''
    $.get('/getUsername', function (data) {
        username = data
    })
    // 请求文章类型并渲染
    $.get('/getArtTypes', function (data) {
        let htmlStr = ``
        data.forEach(function (item, index, array) {
            console.log(item.typeName);
            htmlStr += ` <option value="${item.typeName}">${item.typeName}</option>`
        })
        $('#typeSelect').html(htmlStr)
    })
    // 发布文章的按钮
    $('#subArt').click(function () {
        let title = $('#exampleInputEmail1').val().trim()
        let content = $('#content').val().trim()
        let currentTime = new Date().toISOString()
        let pubTime = currentTime.substring(0, currentTime.indexOf('T'))
        let artType = $('#typeSelect').val()
        let likes = 0

        if (title !== '' && content !== '') {
            $.post('/insertArt',
                {
                    title: title, content: content, username: username, pubTime: pubTime, artType: artType, likes: likes
                },
                function (data) {
                    if (data === '成功!') {
                        alert('添加成功,首页文章分类中可以查看!')
                        location.href = '/index'
                    } else {
                        alert('添加失败了!')
                    }
                })
        } else {
            alert('有选项未填写!')
            return undefined
        }
    })
})
