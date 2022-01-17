// 导入 Joi 来定义验证规则
const Joi = require('joi')

const id = Joi.number().integer().min(1).required()
const title = Joi.string().required()
const content = Joi.string().required()
const pub_data = Joi.date().required()
const cover_img = Joi.string().required()
const state = Joi.number().integer().required()
const cate_id = Joi.number().integer().required()
const author_id = Joi.number().integer().required()


exports.detailArticleSchema = {
    params: {
        id
    }
}


exports.addArticleSchema = {
    body: {
        title,
        content,
        state,
        time: pub_data,
        img: cover_img,
        cateId: cate_id,
        authorId: author_id
    }
}



exports.updateArticleSchema = {
    body: {
        title,
        content,
        state,
        time: pub_data,
        img: cover_img,
        cateId: cate_id,
        authorId: author_id
    },
    params: {
        id
    }
}



