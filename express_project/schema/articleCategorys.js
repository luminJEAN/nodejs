// 导入 Joi 来定义验证规则
const Joi = require('joi')

// 定义 分类名称 和 分类别名 的校验规则
const name = Joi.string().required()
const category = Joi.string().alphanum().required()
const id =  Joi.number().integer().min(1).required()

// 校验规则对象 - 添加分类
module.exports.addCateSchema = {
    body: {
        name,
        category,
    },
}


module.exports.delCateSchema = {
    // // 2.3 校验 req.params 中的数据
    params: {
        id
    }
}

module.exports.updateCateSchema = {
    // // 2.3 校验 req.params 中的数据
    params: {
        id
    },
    body: {
        name,
        category,
    },
}
