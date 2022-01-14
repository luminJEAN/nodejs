const db = require('../db/index')

//加密密码
const bcrypt = require('bcryptjs')
//生成token的包
const Jwt = require('jsonwebtoken')
//导入token的配置密钥和过期时间
const tokenConfig = require('../config/index')



// 注册用户的处理函数
//优化点：
//1.缺少密码的加密和邮箱验证(同时用户名和密码为空的校验可以使用第3方插件joi和@escook/express-joi)
//@escook/express-joi:  https://www.npmjs.com/package/@escook/express-joi/v/1.1.1
//2.可以把res.send('')封住成中间件
//3.密码加密

exports.regUser = (req, res) => {
    console.log('注册的信息', req.body)
    const regInfo = req.body
    // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
    regInfo.password = bcrypt.hashSync(regInfo.password, 10)

    //判断用户名和密码不能为空(由校验规则判断)
    // if (!regInfo.username || !regInfo.password) {
    //     // return res.send('用户名和密码不能为空')
    //     return res.cc('用户名和密码不能为空')
    // }
    //判断用户名是否唯一
    //查询数据库
    const sqlName = 'select * from ev_users where username=?'
    db.query(sqlName, [regInfo.username], (err, result) => {
        if (err) {
            // return res.send({status: '500', mes: err})
            return res.cc(err)
        }
        //查询数据库中是否存在username
        console.log(result)
        if (result.length > 0) {
            // return res.send({status: '500', mes: '用户名存在,请重新输入'})
            return res.cc('用户名存在,请重新输入')
        } else {
            //插入数据库
            const insertData = {
                username: regInfo.username, password: regInfo.password,
                nickName: regInfo.nickName, email: regInfo.email, user_pic: regInfo.user_pic
            }
            const insertSql = 'insert into ev_users set ?'
            db.query(insertSql, insertData, (err, result) => {
                if (err) {
                    // return res.send({status: '500', mes: err})
                    return res.cc(err)
                }
                //result.affectedRows 为1时表示新增成功，不为1时 失败
                if (result.affectedRows !== 1) {
                    // return  res.send({status: '500', mes: '注册用户失败，请稍后再试！'})
                    return res.cc('注册用户失败，请稍后再试！')
                }
                // res.send({status: '200', mes: '新增成功'})
                res.cc('新增成功', 200)
            })
        }
    })

}


// 登录的处理函数
exports.login = (req, res) => {
    //查询用户是否存在
    const sqlName = 'select * From ev_users where username = ?'
    db.query(sqlName, req.body.username ,(err,result)=>{
        if (err)  return res.cc(err)
        if (result.length !== 1) {
            return res.cc('登录失败，请稍后再试！')
        }
        //比较密码是否正确
        const passwordCheck = bcrypt.compareSync(req.body.password, result[0].password)
        console.log(result,passwordCheck)

        if (!passwordCheck) {
            return res.cc('密码错误，请稍后再试！')
        }
        //登录成功之后，生成token,一般不会把密码和图片加密成token
        const userInfo = {...result[0],password: '',user_pic: ''}
        const token = Jwt.sign({userInfo},tokenConfig.serectKey,{ expiresIn: tokenConfig.expiresIn })
        res.cc('登录成功', 200, {...result[0],token: 'Bearer '+ token ,password: ''})
    })

}
