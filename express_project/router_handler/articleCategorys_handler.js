const db = require('../db')


module.exports.getAllHandler = (req, res) => {
    const sqlSearch = 'select id,name,category from article_categorys where is_delete = 0 '
    db.query(sqlSearch, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        console.log(result)
        res.cc('查询成功', 200, result)
    })
}


module.exports.addHandler = (req, res) => {
    const data = req.body
    const sql = 'select * from article_categorys where name = ? or category = ?'
    db.query(sql, [data.name, data.category], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length === 2) {
            return res.cc('名称和类型被占用,请重新输入')
        }
        if (result.length === 1 && data.name === result[0].name && data.category === result[0].category) {
            return res.cc('名称和类型被占用,请重新输入')
        }
        if (result.length === 1 && data.name === result[0].name) {
            return res.cc('名称被占用,请重新输入')
        }
        if (result.length === 1 && data.category === result[0].category) {
            return res.cc('类型被占用,请重新输入')
        }

        //数据验证通过,插入数据库
        const sqlInsert = 'insert into article_categorys set ?'
        db.query(sqlInsert, data, (err, addResult) => {
            if (err) {
                return res.cc(err)
            }
            if (addResult.affectedRows !== 1) {
                return res.cc('新增失败')
            }
            res.cc('新增成功', 200)
        })
    })
}


module.exports.delHandler = (req, res) => {
    const id = req.params.id
    const sqlDel = 'Update article_categorys set is_delete = 1 where id = ?'
    db.query(sqlDel, id, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.affectedRows !== 1) {
            return res.cc('删除失败')
        }
        res.cc('删除成功', 200)
    })
}

module.exports.detailHandler = (req, res) => {
    const id = req.params.id
    const sqlSelect = 'select id,name,category from article_categorys where id =? and is_delete = 0'
    db.query(sqlSelect, id, (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length !== 1) {
            return res.cc('查询失败')
        }
        res.cc('查询成功', 200, result[0])
    })
}


module.exports.updateHandler = (req, res) => {
    const id = req.params.id
    const data = req.body
    //先查看数据库中是否存在name和category,要排除掉当前的id
    const selectSql = 'select * from article_categorys where id <> ? and (name = ? or category = ?)';
    db.query(selectSql, [id, data.name, data.category], (err, result) => {
        if (err) {
            return res.cc(err)
        }
        if (result.length === 2) {
            return res.cc('名称和类型被占用,请重新输入')
        }
        if (result.length === 1 && data.name === result[0].name && data.category === result[0].category) {
            return res.cc('名称和类型被占用,请重新输入')
        }
        if (result.length === 1 && data.name === result[0].name) {
            return res.cc('名称被占用,请重新输入')
        }
        if (result.length === 1 && data.category === result[0].category) {
            return res.cc('类型被占用,请重新输入')
        }
        const updateSql = 'update article_categorys set ? where id=?'
        db.query(updateSql, [data, id], (err, result) => {
            if (err) {
                return res.cc(err)
            }
            if (result.affectedRows !== 1) {
                return res.cc('更新失败')
            }
            res.cc('更新成功', 200)
        })
    })


}
