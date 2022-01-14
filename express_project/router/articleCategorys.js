const express = require('express')
const router = express.Router()


const articleCategorysHandler = require('../router_handler/articleCategorys_handler')
//导入校验规则
// 1. 导入 @escook/express-joi
const expressJoi = require('@escook/express-joi')
const { addCateSchema, delCateSchema, updateCateSchema } = require('../schema/articleCategorys')

//获取文章分类列表
router.get('/getAll',articleCategorysHandler.getAllHandler)

//新增文章分类
router.post('/add', expressJoi(addCateSchema), articleCategorysHandler.addHandler)

// 根据 Id 删除文章分类
router.post('/delete/:id', expressJoi(delCateSchema), articleCategorysHandler.delHandler)


//根据 Id 获取文章分类数据
router.get('/getDetail/:id', expressJoi(delCateSchema), articleCategorysHandler.detailHandler)

//根据 Id 获取文章分类数据
router.post('/update/:id', expressJoi(updateCateSchema), articleCategorysHandler.updateHandler)

module.exports = router
