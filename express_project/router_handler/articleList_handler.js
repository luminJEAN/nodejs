const db = require('../db')

module.exports.getAll = (req, res) => {
    const selectSql = 'select * from ev_articles where is_delete = 0 order by id desc';
    db.query(selectSql, (err, result) => {
        if (err) return res.cc(err)
        const data = {result, total: result.length}
        res.cc('查询成功', 200, data)
    })
}


module.exports.add = (req, res) => {
    const data = {
        title: req.body.title,
        content: req.body.content,
        state: req.body.state,
        pub_data: req.body.time,
        cover_img: req.body.img,
        cate_id: req.body.cateId,
        author_id: req.body.authorId
    }

    //title 唯一
    const selectSql = 'select * from ev_articles where title = ?'
    db.query(selectSql, data.title, (err, result) => {
        if (err) return res.cc(err)
        if (result.length === 1) {
            return res.cc('title 已存在，请重新输入！')
        }
        const insertSql = 'insert into ev_articles set ?'
        db.query(insertSql, data, (err, result) => {
            if (err) return res.cc(err)
            if (result.affectedRows !== 1) {
                return res.cc('新增失败')
            }
            res.cc('新增成功', 200)
        })
    })

}

module.exports.getDetail = (req, res) => {
    const id = req.params.id
    const selectSql = 'select * from ev_articles ' +
        'INNER JOIN article_categorys ON ev_articles.cate_id = article_categorys.id ' +
        'INNER JOIN ev_users ON ev_articles.author_id = ev_users.id where ev_articles.id = ?'
    db.query(selectSql, id, (err, result) => {
        if (err) return res.cc(err)

        if (result.length !== 1) {
            return res.cc('查询失败！')
        }
        res.cc('查询成功', 200, result[0])
    })
}



