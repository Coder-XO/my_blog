$(function ($) {
    $('.updateInfo').addClass('active')
    // 请求个人信息
    $.get('/doGetInfo', function (data) {
        console.log(data)
        if (data.state === 0) {
            $('#setInfo').show()
        } else {

        }
    })
    console.log(111)
    // 个人中心页面
    // 点击个人信息
    $('.updateInfo').click(function () {
        $('.updateSecret').removeClass('active')
        $(this).addClass('active')
        // 看是否有个人信息
        $.get('/doGetInfo', function (data) {
            console.log(data)
            if (data.state === 0) {
                $('#setInfo').show()
            } else {
                $('#showInfo').show()
            }
        })
        $('.secret').hide()  // 修改密码模块显示
        $('.info').show()  // 信息修改隐藏
    })

    // 点击修改密码
    $('.updateSecret').click(function () {
        $('#showInfo').hide()
        $('.updateInfo').removeClass('active')
        $(this).addClass('active')
        $('.secret').show()  // 修改密码模块显示
        $('.info').hide()  // 信息修改隐藏
        $('#personInfo').hide()


        // 请求密保问题
        $.get('/getSecret', function (data) {
            $.get('/getQuestion', {id: data}, function (data2) {
                console.log(data2)
                $('#questionContent').html(`您的密保问题是:${data2}`)
            })
        })
    })


    // 事件委托
    $('.content').on('click', '.btn', function () {
        $(this).hide()
        $('#personInfo').show()
    })


    // 修改信息按钮
    $('#updateInfo').click(function () {
        $('#showInfo input,textarea').prop('readonly', false).prop('disabled', false)
        $(this).hide()  // 隐藏
        $('#submit').show()  //提交按钮隐藏
    })
    let gender2 = $('input[type=radio]:checked').val()
    $('input[value=男]').click(function () {
        gender2 = '男'
    })
    $('input[value=女]').click(function () {
        gender2 = '女'
    })
    // 修改信息的提交
    $('#submit').click(function () {
        let realname = $('#realname').val()
        console.log(realname)
        let username = $('input[name=username]').val()
        let gender = gender2
        let age = $('#age').val()
        let motto = $('#motto').val()

        console.log(gender)
        $.post('/doUpdateInfo', {
            realname: realname,
            username: username,
            gender: gender,
            age: age,
            motto: motto
        }, function (data) {
            if (data.res) {
                location.href = '/person'
            } else {
                location.href = '/person'
            }
        })
    })


    // 个人信息你的提交
    $('#setPersonInfo').click(function (e) {
        // e.preventDefault()
        let realname = $('#personInfo input[name=realname]').val().trim()
        let gender = $('#personInfo input[name=gender]:checked').val().trim()
        let age = $('#personInfo input[name=age]').val().trim()
        let motto = $('#personInfo textarea[name=motto]').val().trim()
        if (realname !== '' && age !== "" && motto !== '') {
            return true
        } else {
            alert('信息未填写完整!')
            return false
        }
    })


    // 确认修改
    $('#confirmUpdate').click(function () {
        let answer = $('#answer').val().trim()
        let newSecret = $('#newSecret').val().trim()
        let reNewScret = $('#reNewScret').val().trim()
        let uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
        if (newSecret === reNewScret) { //两次相等
            if (uPattern.test(newSecret)) {
                return true
            } else {
                alert('密码格式不正确!')
            }
        } else {
            alert('两次密码不一样!')
        }
        return false
    })
})
