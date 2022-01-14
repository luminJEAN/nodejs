const db = require('../db')

// const
const bcrypt = require('bcryptjs')

module.exports.getUserInfo = (req, res) => {
    //注意：req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件帮我们挂载上去的
    const userId = req.user.userInfo.id
    const sqlUser = 'select id,username,nickname,email,user_pic from ev_users where id =?'

    db.query(sqlUser, userId, (err, result) => {
        //执行 SQL 语句失败
        if (err) {
            return res.cc(err)
        }
        console.log(result)
        // 执行 SQL 语句成功，但是查询到的数据条数不等于 1
        if (result.length !== 1) {
            return res.cc('获取用户信息失败')
        }

        //查找到id的数据返回
        res.cc('查找成功', 200, result[0])
    })

    // return res.cc('getUserInfo')
}


module.exports.updateUserInfo = (req, res) => {
    const userId = req.user.userInfo.id
    //更新的数据
    const updateData = req.body
    //bcrypt密码加密
    // updateData.password = bcrypt.hashSync(updateData.password, 10)
    console.log(1234, updateData)
    const sqlUpate = 'update ev_users set ? where id = ?'
    db.query(sqlUpate, [updateData, userId], (err, result) => {
        if (err) {
            return res.cc(err)
        }

        if (result.affectedRows !== 1) {
            return res.cc('更新失败')
        }
        res.cc('更新成功', 200)
    })
}


module.exports.updatePassword = (req, res) => {
    const userId = req.user.userInfo.id
    //更新的数据
    const updateData = req.body
    console.log(12344, updateData)
    const sqlSelect = 'select * from ev_users where id = ?'
    db.query(sqlSelect, userId, (err, result) => {
        if (err) return res.cc(err)

        if (result.length !== 1) {
            return res.cc('更新失败')
        }
        const isEqual = bcrypt.compareSync(updateData.oldPwd, result[0].password)
        console.log(12344, updateData.oldPwd, result[0].password, isEqual)

        if (!isEqual) {
            return res.cc('原密码输入错误')
        }

        const sqlUpdate = 'update ev_users set ?  where id = ?'
        //bcrypt密码加密
        const data = {password: bcrypt.hashSync(updateData.newPwd, 10)}

        db.query(sqlUpdate, [data, req.user.userInfo.id], (err1, result1) => {
            if (err1) return res.cc(err1)

            if (result1.affectedRows !== 1) {
                return res.cc('更新失败')
            }
            res.cc('更新成功', 200)
        })
    })

}
