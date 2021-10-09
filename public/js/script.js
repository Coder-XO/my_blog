$(function () {

    $.get('/login', function (data) {   // 请求一下页面
        console.log(data)
    })
    // 注册按钮
    $('#sub').click(function () {
        let username = $('.username').val().trim()
        let pwd = $('.pwd').val().trim()
        let uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
        if (!uPattern.test(username)) {
            alert('用户名格式不正确!')
            $('.username').val('')
            return false
        }
        if (!uPattern.test(pwd)) {
            alert('密码格式不正确!')
            $('.pwd').val('')
            return false
        }
        return true
    })
    // 登录按钮


    // 提交用户信息恩牛

})
