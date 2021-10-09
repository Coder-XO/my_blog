$(function () {
    carousel(
        $('.demo1'),	//必选， 要轮播模块(id/class/tagname均可)，必须为jQuery元素
        {
            type: 'leftright',	//可选，默认左右(leftright) - 'leftright' / 'updown' / 'fade' (左右/上下/渐隐渐现)
            arrowtype: 'move',	//可选，默认一直显示 - 'move' / 'none'	(鼠标移上显示 / 不显示 )
            autoplay: true,	//可选，默认true - true / false (开启轮播/关闭轮播)
            time: 2000	//可选，默认3000
        }
    );

    // 请求文章类型
    $.get('/getArtTypes', function (data) {
        let htmlStr = ``
        data.forEach(function (item, index, array) {
            htmlStr += ` <li><a href="javascript:void(0);">${item.typeName}</a></li>`
        })
        $('#artType').html(htmlStr)
    })

    // 请求所有文章  并渲染
    $.get('/allArt', function (data) {
        console.log(data)
        let htmlStr = ``
        let strArr = []
        data.forEach(function (item) {
            strArr.push(item.content)
            htmlStr += `<div class="rows clearfix">
                <div class="img-block fl">
                    <img src="./public/img/5.jpg" alt="">
                </div>
                <div class="content-block fr">
                    <a href="/detail?id=${item.id}">
                        <h2>${item.title}</h2>
                    </a>
                    <div class="otherinfo"><span class="author">${item.username}</span><span class="date">${item.pubTime}</span></div>
                    <p id="contentP"></p>
                    <i class="tag" style="background-color: #ab1abc;width: 48px;height: 22px;display: flex;justify-content: center;align-items: center"><a href="#" style="font-size: 12px">${item.artType}</a></i>
                    <span class="view">共<i>${item.likes}</i>个人点赞</span>
                </div>
            </div>`
        })
        $('#bigBox').html(htmlStr)
        for (let i = 0; i < $('#bigBox p#contentP').length; i++) {
            $('#bigBox p#contentP')[i].innerText = strArr[i]
        }
    })


    // 搜索文章并显示
    $('#searchArt').click(function () {
        let keyWord = $('#keyWord').val().trim()
        if (keyWord === '') {
            alert('查询关键词为空!')
            return undefined
        } else {   // 展示搜索的文章
            $.get('/someArt', {keyWord: keyWord}, function (data) {
                if (data === '未找到!') {
                    alert('没有找到相关文章!')
                } else {
                    let htmlStr = ``
                    let strArr = []
                    data.forEach(function (item) {
                        strArr.push(item.content)
                        htmlStr += `<div class="rows clearfix">
                <div class="img-block fl">
                    <img src="./public/img/5.jpg" alt="">
                </div>
                <div class="content-block fr">
                    <a href="/detail?id=${item.id}">
                        <h2>${item.title}</h2>
                    </a>
                    <div class="otherinfo"><span class="author">${item.username}</span><span class="date">${item.pubTime}</span></div>
                    <p id="contentP"></p>
                    <i class="tag" style="background-color: #ab1abc;width: 48px;height: 22px;display: flex;justify-content: center;align-items: center"><a href="#" style="font-size: 12px">${item.artType}</a></i>
                    <span class="view">共<i>${item.likes}</i>个人点赞</span>
                </div>
            </div>`
                    })
                    $('#bigBox').html(htmlStr)
                    for (let i = 0; i < $('#bigBox p#contentP').length; i++) {
                        $('#bigBox p#contentP')[i].innerText = strArr[i]
                    }
                }
            })
        }
    })

    // 文章分类展示  事件委托
    $('#artType').on('click', 'li a', function () {
        let typeName = $(this).text()
        $.get('/typedArt', {typeName: typeName}, function (data) {
            if (data === '未找到!') {
                alert('没有此类文章!赶紧发布一个吧!')
            } else {
                let htmlStr = ``
                let strArr = []
                data.forEach(function (item) {
                    strArr.push(item.content)
                    htmlStr += `<div class="rows clearfix">
                <div class="img-block fl">
                    <img src="./public/img/5.jpg" alt="">
                </div>
                <div class="content-block fr">
                    <a href="/detail?id=${item.id}">
                        <h2>${item.title}</h2>
                    </a>
                    <div class="otherinfo"><span class="author">${item.username}</span><span class="date">${item.pubTime}</span></div>
                    <p id="contentP"></p>
                    <i class="tag" style="background-color: #ab1abc;width: 48px;height: 22px;display: flex;justify-content: center;align-items: center"><a href="#" style="font-size: 12px">${item.artType}</a></i>
                    <span class="view">共<i>${item.likes}</i>个人点赞</span>
                </div>
            </div>`
                })
                $('#bigBox').html(htmlStr)
                for (let i = 0; i < $('#bigBox p#contentP').length; i++) {
                    $('#bigBox p#contentP')[i].innerText = strArr[i]
                }
            }
        })
    })
})
