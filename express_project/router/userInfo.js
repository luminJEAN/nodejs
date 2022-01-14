const express = require('express')
const router = express.Router()

// 1. 导入 @escook/express-joi
const expressJoi = require('@escook/express-joi')
// 导入 user校验的规则
const userInfoCheck = require('../schema/userInfo')


//导入基本信息的处理函数
const userInfoHandler = require('../router_handler/userInfo_handler')

//获取用户的基本信息
router.get('/getInfo', userInfoHandler.getUserInfo)

//更新用户的基本信息（）
router.post('/update', expressJoi(userInfoCheck.userInfoSchema), userInfoHandler.updateUserInfo)

//修改用户的密码（要输入原密码）

router.post('/updatePassword', expressJoi(userInfoCheck.passwordSchema), userInfoHandler.updatePassword)

module.exports = router
