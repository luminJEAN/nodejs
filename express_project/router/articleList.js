const express = require('express')
const router = express.Router()

// 1. 导入 @escook/express-joi
const expressJoi = require('@escook/express-joi')
const {detailArticleSchema, addArticleSchema} = require('../schema/articleList')

const articleListHandler = require('../router_handler/articleList_handler')

//查询所有的列表
router.get('/getAll', articleListHandler.getAll)

//查询文章的详情
router.get('/getDetail/:id', expressJoi(detailArticleSchema), articleListHandler.getDetail)

//新增
router.post('/add', expressJoi(addArticleSchema), articleListHandler.add)

module.exports = router
