let http = require('http')
let express = require('express')
let formidable = require('formidable')
let mysql = require('mysql')
let urll = require('url')
let cookieParser = require('cookie-parser')
let app = express()
app.set('views', './views')
app.set('view engine', 'ejs')
app.use(express.static(__dirname))  // 资源路径
app.use(cookieParser())   // cookie中间件

/**
 * 业务逻辑  路由触发请求
 */
app.get('/index', function (req, res) {
    if (!req.cookies.username) {
        res.render('index', {data: '游客'})
    } else {
        res.render('index', {data: req.cookies.username})
    }
})

app.get('/', function (req, res) {
    if (!req.cookies.username) {
        res.render('index', {data: '游客'})
    } else {
        res.render('index', {data: req.cookies.username})
    }
})
// app.get('/detail', function (req, res) {
//     res.render('detail')
// })
// 注册登录页面显示
app.get('/login', function (req, res) {
    let sql = 'select id,content from questions'
    connection.query(sql, function (err, results) {
        if (results.length > 0) {
            console.log(results)
            console.log(555)
            console.log(results)
            res.render('login', {results})
        } else {
            res.render('login')
        }
    })
})
// 数据库配置
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'my_blog'
})
connection.connect()

// 注册逻辑
app.post('/doReg', function (req, res) {
    let form = new formidable.IncomingForm()
    form.parse(req, function (err, fields) {

        let sql2 = 'insert into secrets values(null,?,?,?)'
        console.log(fields)
        let opt2 = [fields.username, fields.question, fields.anwser]
        sql2 = mysql.format(sql2, opt2)
        connection.query(sql2, function (err, results) {
            console.log(err);
            console.log(sql2)
            if (results.affectedRows > 0) {
                console.log('密保保存成功!')
            } else {
            }
        })

        let sql = 'insert into users values(?,?)'
        console.log(fields)
        let opt = [fields.username, fields.pwd]
        sql = mysql.format(sql, opt)
        connection.query(sql, function (err, results) {
            console.log(err)
            if (results.affectedRows > 0) {
                res.redirect('/login')
            } else {
                res.redirect('/error')
            }
        })
    })
})

// 登录的逻辑
app.post('/doLogin', function (req, res) {
    let form = new formidable.IncomingForm()
    form.parse(req, function (err, fields) {
        let sql = 'select * from users where username=?'
        let opt = [fields.username]
        sql = mysql.format(sql, opt)
        connection.query(sql, function (err, results) {
            if (err) {
                res.redirect('/error')
            } else {
                if (results.length > 0) {
                    if (results[0].pwd === fields.pwd) { // 登录成功了
                        res.cookie('username', fields.username) // 设置cookie
                        res.redirect('/index')
                    } else {
                        res.redirect('/error')
                    }
                } else {
                    res.redirect('/error')
                }
            }
        })
    })
})
// 密码错误!
app.get('/error', function (req, res) {
    res.render('error')
})
// 退出的逻辑
app.get('/logout', function (req, res) {
    if (!req.cookies) {
        res.redirect('/login')
    }
    if (req.cookies.username) {
        res.clearCookie('username')
        res.redirect('/login')
    } else {
        res.redirect('/login')
    }
})
// 个人中心页面
app.get('/person', function (req, res) {
    if (!req.cookies.username) {
        res.redirect('/login')
    } else {
        console.log('走查询了')
        let sql = 'select * from userinfo where username = ?'
        let opt = [req.cookies.username]
        sql = mysql.format(sql, opt)
        connection.query(sql, function (err, results) {
            if (err) {
                console.log('出错了!')
                res.end()
            } else {
                if (results.length > 0) {
                    console.log(results[0])
                    res.render('person', {data: req.cookies.username, res: results[0]})
                } else {
                    console.log('没有信息')
                    res.render('person', {data: req.cookies.username, res: undefined})
                }
            }
        })
    }
})

// 请求个人信息
app.get('/doGetInfo', function (req, res) {
    if (req.cookies.username) {
        let sql = 'select * from userinfo where username = ?'
        let opt = [req.cookies.username]
        sql = mysql.format(sql, opt)
        connection.query(sql, function (err, results) {
            if (err) {
                console.log('出错了!')
                res.end()
            } else {
                if (results.length > 0) {
                    res.json({state: 1, data: results[0]})
                } else {
                    console.log('没有信息')
                    res.json({state: 0})
                }
            }
        })
    }
})


// 修改个人信息逻辑
app.post('/doUpdateInfo', function (req, res) {
    let form = new formidable.IncomingForm()
    form.parse(req, function (err, fields) {
        let sql = 'update userinfo set realName=?,username=?,gender=?,age=?,motto=? where username=?'
        let opt = [fields.realname, fields.username, fields.gender, fields.age, fields.motto, fields.username]
        sql = mysql.format(sql, opt)
        console.log(sql)
        connection.query(sql, function (err, results) {
            if (!err) {
                if (results.affectedRows > 0) {
                    res.json({res: true})
                } else {
                    res.json({res: false})
                }
            } else {
                res.json({res: false})
            }
        })
    })
})


// 添加个人信息的逻辑
app.post('/doSetInfo', function (req, res) {
    let form = new formidable.IncomingForm()
    form.parse(req, function (err, fields) {
        let sql = 'insert into userinfo values(null,?,?,?,?,?)'
        let opt = [fields.realname, req.cookies.username, fields.gender, fields.age, fields.motto]
        sql = mysql.format(sql, opt)
        console.log(sql)
        connection.query(sql, function (err, results) {
            if (!err) {
                if (results.affectedRows > 0) {   // 插入成功能!
                    res.redirect('/person')
                } else {
                    res.redirect('/person')
                }
            } else {
                res.redirect('/person')
            }
        })
    })
})


// 获取密保问题
app.get('/getSecret', function (req, res) {
    let sql = 'select questionId from secrets where username=?'
    let opt = [req.cookies.username]
    sql = mysql.format(sql, opt)
    console.log(sql)
    connection.query(sql, function (err, results) {
        if (!err) {
            if (results.length > 0) {
                res.json(results[0].questionId)   // 返回密保问题id
            } else {
                res.redirect('/person')
            }
        } else {
            res.redirect('/person')
        }
    })
})

app.get('/getQuestion', function (req, res) {
    let id = urll.parse(req.url, true).query.id
    let sql = 'select content from questions where id=?'
    let opt = [id]
    sql = mysql.format(sql, opt)
    console.log(sql)
    connection.query(sql, function (err, results) {
        if (!err) {
            if (results.length > 0) {
                res.json(results[0].content)   // 返回密保问题内容
            } else {
                res.redirect('/person')
            }
        } else {
            res.redirect('/person')
        }
    })
})

// 密码修改
app.post('/doUpdateSecret', function (req, res) {
    let form = new formidable.IncomingForm()
    form.parse(req, function (err, fields) {
        // 判断密保是否正确
        let sql1 = 'select answer from secrets where username = ?'
        let opt1 = [req.cookies.username]
        sql1 = mysql.format(sql1, opt1)
        connection.query(sql1, function (err, results) {
            if (!err) {
                console.log(results)
                if (results.length > 0) {    //找到答案
                    if (results[0].answer === fields.answer) {   // 密保成功!
                        let sql = 'update users set pwd = ? where username=?'
                        let opt = [fields.newSecret, req.cookies.username]
                        sql = mysql.format(sql, opt)
                        console.log(sql)
                        connection.query(sql, function (err, results) {
                            if (!err) {
                                if (results.affectedRows > 0) {
                                    res.redirect('/login')
                                }
                            } else {
                                console.log('白了')
                                res.redirect('/person')
                            }
                        })
                    } else {
                        console.log('密保错误')
                        res.redirect('/person')
                    }
                } else {
                    console.log('白了')
                    res.redirect('/person')
                }
            } else {
                console.log(err)
                res.end()
            }
        })
    })
})

// 请求用户名
app.get('/getUsername', function (req, res) {
    res.json(req.cookies.username)
})

// 进入发布文章页面
app.get('/pub', function (req, res) {
    if (req.cookies.username) {
        res.render('pub')
    } else {
        res.redirect('/login')
    }
})

// 返回文章类型的请求
app.get('/getArtTypes', function (req, res) {
    let sql = 'select typeName from arttype'
    connection.query(sql, function (err, results) {
        if (!err) {
            console.log(results)
            res.json(results)
        } else {
            console.log('')
            res.end()
        }
    })
})

// 插入文章的逻辑
app.post('/insertArt', function (req, res) {
    let form = new formidable.IncomingForm()
    form.parse(req, function (err, fields) {
        console.log(fields)
        let sql = 'insert into article values(null,?,?,?,?,?,?)'
        let opt = [fields.title, fields.content, fields.username, fields.pubTime, fields.artType, fields.likes]
        sql = mysql.format(sql, opt)
        connection.query(sql, function (err, results) {
            if (!err) {
                if (results.affectedRows > 0) {
                    res.json('成功!')
                }
            } else {
                console.log(err)
                res.json('失败了')
            }
        })
    })
})

// 请求所有文章
app.get('/allArt', function (req, res) {
    let sql = 'select * from article'
    connection.query(sql, function (err, results) {
        if (!err) {
            if (results.length > 0) {
                res.json(results)
            } else {
                res.json('出错了!')
            }
        } else {
            res.end()
        }
    })
})

// 模糊查询文章
app.get('/someArt', function (req, res) {
    let keyWord = urll.parse(req.url, true).query.keyWord
    let sql = `select * from article where title like "%${keyWord}%"`
    connection.query(sql, function (err, results) {
        console.log(sql)
        if (!err) {
            if (results.length === 0) {
                res.json('未找到!')
            } else {
                res.json(results)
            }
        } else {
            console.log(err)
            console.log('出错了!')
            res.end()
        }
    })
})


// 请求固定类型的文章
app.get('/typedArt', function (req, res) {
    let typeName = urll.parse(req.url, true).query.typeName
    let sql = `select * from article where artType = ?`
    let opt = [typeName]
    sql = mysql.format(sql, opt)
    connection.query(sql, function (err, results) {
        console.log(sql)
        if (!err) {
            if (results.length === 0) {
                res.json('未找到!')
            } else {
                res.json(results)
            }
        } else {
            console.log(err)
            console.log('出错了!')
            res.end()
        }
    })
})

// 文章的详情
app.get('/detail', function (req, res) {
    let id = urll.parse(req.url, true).query.id
    let sql = `select * from article where id=?`
    let opt = [id]
    sql = mysql.format(sql, opt)
    connection.query(sql, function (err, results) {
        console.log(sql)
        if (!err) {
            if (results.length === 0) {
                res.json('未找到!')
            } else {
                res.render('detail', {res: results[0]})
            }
        } else {
            console.log(err)
            console.log('出错了!')
            res.end()
        }
    })
})


// 插入评论
app.post('/insertCom', function (req, res) {
    if (req.cookies.username) {
        let form = new formidable.IncomingForm()
        form.parse(req, function (err, fields) {
            console.log(fields)
            let sql = 'insert into comments values(null,?,?,?,?)'
            let opt = [req.cookies.username, fields.content, fields.pubTime, fields.id]
            sql = mysql.format(sql, opt)
            connection.query(sql, function (err, results) {
                if (!err) {
                    if (results.affectedRows > 0) {
                        res.json('成功!')
                    } else {
                        res.redirect('/login')
                    }
                } else {
                    console.log(err)
                }
            })
        })
    } else {
        res.json('请登录!')
    }
})


// 查询指定文章的评论
app.get('/getCom', function (req, res) {
    let id = urll.parse(req.url, true).query.id
    let sql = `select * from comments where articleId=?`
    let opt = [id]
    sql = mysql.format(sql, opt)
    connection.query(sql, function (err, results) {
        console.log(sql)
        if (!err) {
            if (results.length === 0) {
                res.json('未找到!')
            } else {
                res.json(results)
            }
        } else {
            console.log(err)
            console.log('出错了!')
            res.end()
        }
    })
})
app.listen(9000)
