const express = require('express')
//解决跨域
const cors = require('cors')
//配置解析表单post请求体数据
const bodyParser = require('body-parser')
const Joi = require('joi')
//导入token的配置密钥和过期时间
const tokenConfig = require('./config/index')
//导入解析token的包
const expressJwt =require('express-jwt')

const app = express()
app.use(cors())
// 配置 body-parser 中间件
// 只要加入这个配置，在 req 请求对象上会多出来一个属性：body
// 也就是说可以直接通过 req.body 来获取表单 POST 请求体数据了
app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())
//解析token,获取token中用户的信息,配置成功之后，可以通过req.user 获取
app.use(expressJwt({ secret: tokenConfig.serectKey, algorithms: ['HS256']}).unless({path: [/^\/api\//]}));


// 把res.send('')封住成中间件,中间件上挂在res上的属性，在路由回掉函数中都可以直接使用
app.use((req,res,next)=>{
    res.cc = function(err, status = 500, data = null) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err,
            data
        })
    }
    next()
})

//导入登录注册路由模块
const userRouter = require('./router/user')
//为用户模块添加前缀
app.use('/api', userRouter)
//导入用户信息路由模块
const userInfoRouter = require('./router/userInfo')
//为用户模块添加前缀
app.use('/userInfo', userInfoRouter)

//导入文章类别路由模块
const articleCategorysRouter = require('./router/articleCategorys')
app.use('/category', articleCategorysRouter)

//导入文章列表路由模块
const articleListRouter = require('./router/articleList')
app.use('/article', articleListRouter)

// 错误级别中间件
app.use(function (err, req, res, next) {
    // Joi 参数校验失败
    if (err instanceof Joi.ValidationError) {
        return res.send({
            status: 500,
            message: err.message
        })
    }
    if (err.name === 'UnauthorizedError') {
        return res.send({
            status: 401,
            message: err.message
        })
    }
    // 4.2 未知错误
    res.send({
        status: 500,
        message: err
    })
})


app.listen(80,()=> {
    console.log('服务器启动成功了, http://127.0.0.1')
})
