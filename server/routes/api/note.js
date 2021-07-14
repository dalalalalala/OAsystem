// @login & register
const express = require('express');
const { normalizeUnits } = require('moment');
const router = express.Router();
const passport = require('passport');

const Note = require('../../models/Note');



// @route  POST api/projectinfo/add
// @desc   创建便签信息接口
// @access Private
router.post(
  '/edit',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const notesFields = {};

    notesFields.createUser = req.user.name
    if (req.body.noteTitle) notesFields.noteTitle = req.body.noteTitle;
    if (req.body.noteContent) notesFields.noteContent = req.body.noteContent;
    
    // 判断如果id不为空则为编辑，否则为修改
    if (req.body._id != '') {
      Note.findOneAndUpdate(
        { _id: req.body._id },
        { $set: notesFields },
        { new: true }
      ).then(note => {
        res.json({
          code: 1,
          msg: '便签信息修改成功！',
          data: note
        })
      })
    } else {
      new Note(notesFields).save().then(note => {
        res.json({
          code: 1,
          msg: '便签信息新增成功！',
          data: note
        });
      });
    }

  }
);

// @route  GET api/projectinfo
// @desc   获取本人所有便签信息
// @access Private

router.post('/list', passport.authenticate('jwt', { session: false }), function (req, res) {

  var data = {
    normalizeUnits: [],
    // 获取不到page时默认为打开在第一页
    page: Number(req.query.page || 1),
    limit: Number(req.query.size || 10),
    pages: 1,
    count: 0
  }
  var dataParams = { createUser : req.user.name}
  for (let key in req.body) {
    if (req.body[key] != '' && key !='createUser') {
      dataParams[key] = req.body[key]
    }
  }

  Note.find(dataParams).then((normalizeUnits) => {
    if (!normalizeUnits) {
      return res.json({
        code: 0,
        msg: '没有任何内容',
        count: normalizeUnits.length
      });
    }
    // data.normalizeUnits = normalizeUnits;
    // 获取读取内容的总记录
    return normalizeUnits.length
  }).then((count) => {
    //为了方便,将总记录数存入data对象中
    data.count = count

    //计算总页数，向上取整数, 取最大值
    data.pages = Math.ceil(data.count / data.limit)
    // 页数取值不能超过总页数的值或小于1
    // Math.min(),Math.max()限制最小值最大值
    data.page = Math.min(data.page, data.pages)  //2
    data.page = Math.max(data.page, 1)  //2

    var skip = (data.page - 1) * data.limit

    return Note.find(dataParams).limit(data.limit).skip(skip)
  }).then((normalizeUnits) => {
    data.normalizeUnits = normalizeUnits

    // console.log(data)
    /**最后渲染 */
    res.json(
      {
        code: 1,
        msg: '数据查找成功！',
        data: data.normalizeUnits,
        page: data.page,
        limit: data.limit,
        pages: data.pages,
        total: data.count,
        aa: dataParams
      }
    )
  }).catch(err => res.status(404).json(err));
})


// // @route  GET api/projectinfo/:id
// // @desc   获取单个便签信息
// // @access Private

router.get(
  '/getByid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Note.findOne({ _id: req.query.id })
      .then(note => {
        if (!note) {
          return res.json('没有任何内容');
        }

        res.json({
          code: 1,
          msg: '数据查找成功！',
          data: note
        })
      })
      .catch(err => res.status(404).json(err));
  }
);



// // @route  POST api/projectinfo/delete/:id
// // @desc   删除便签信息接口
// // @access Private
router.get(
  '/remove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Note.findOneAndRemove({ _id: req.query.id })
      .then(note => {
        note.save().then(note => {
          res.json({
            code: 1,
            msg: '数据删除成功！',
            data: note
          })
        });
      })
      .catch(err => res.json({
        code: 0,
        msg: '数据删除失败！',
      }));
  }
);

// // @route  POST api/projectinfo/delete/:id
// // @desc   多项删除便签信息接口
// // @access Private
router.post(
  '/batchRemove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.body.ids)
    Note.remove({ _id: { $in: req.body.ids } })
      .then(note => {
        res.json({
          code: 1,
          msg: '数据删除成功！',
          data: note
        })
      })
      .catch(err => res.json({
        code: 0,
        msg: '数据删除失败！',
      }));
  }
);

module.exports = router;
