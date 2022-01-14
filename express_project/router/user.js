const express = require('express')

const userHandler = require('../router_handler/user_handler')

// 1. 导入 @escook/express-joi
const expressJoi = require('@escook/express-joi')
// 导入 user校验的规则
const userCheck = require('../schema/user')
console.log(userCheck.userSchema)

const router = express.Router()

router.post('/register', expressJoi(userCheck.userSchema), userHandler.regUser)

router.post('/login', expressJoi(userCheck.userloginSchema), userHandler.login)


module.exports = router
