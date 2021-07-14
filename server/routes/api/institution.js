// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const Depart = require('../../models/Depart');



// @route  POST api/projectinfo/add
// @desc   创建部门信息接口
// @access Private
router.post(
  '/edit',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const departsFields = {};

    if (req.body.departName) departsFields.departName = req.body.departName;
    if (req.body.director) departsFields.director = req.body.director;
    if (req.body.departDuty) departsFields.departDuty = req.body.departDuty;
    if (req.body.departDesc) departsFields.departDesc = req.body.departDesc;
    

    // 判断如果id不为空则为编辑，否则为修改
    if (req.body._id != '') {
      Depart.findOneAndUpdate(
        { _id: req.body._id },
        { $set: departsFields },
        { new: true }
      ).then(departs => {
        res.json({
          code: 1,
          msg: '部门信息修改成功！',
          data: departs
        })
      })
    } else {
      new Depart(departsFields).save().then(departs => {
        res.json({
          code: 1,
          msg: '部门信息新增成功！',
          data: departs
        });
      });
    }

  }
);

// @route  GET api/projectinfo
// @desc   获取所有部门信息
// @access Private

router.post('/list', passport.authenticate('jwt', { session: false }),function (req, res) {

  var data = {
    departs: [],
    // 获取不到page时默认为打开在第一页
    page: Number(req.query.page || 1),
    limit: Number(req.query.size || 4),
    pages: 1,
    count: 0
  }
  var dataParams = {}
  for (let key in req.body) {
    if (req.body[key] != '' && key != 'action') {
      dataParams[key] = req.body[key]
    }
  }
  
  Depart.find(dataParams).then((departs) => {
    if (!departs) {
      return res.json({
        code: 0,
        msg: '没有任何内容',
        count: departs.length
      });
    }
    // data.departs = departs;
    // 获取读取内容的总记录
    return departs.length
  }).then((count) => {
    //为了方便,将总记录数存入data对象中
    data.count = count

    if (req.body.action == 'allData') {
      data.limit = count
      data.page = 1
    }

    //计算总页数，向上取整数, 取最大值
    data.pages = Math.ceil(data.count / data.limit)
    // 页数取值不能超过总页数的值或小于1
    // Math.min(),Math.max()限制最小值最大值
    data.page = Math.min(data.page, data.pages)  //2
    data.page = Math.max(data.page, 1)  //2

    var skip = (data.page - 1) * data.limit

    return Depart.find(dataParams).limit(data.limit).skip(skip)
  }).then((departs) => {
    data.departs = departs

    // console.log(data)
    /**最后渲染 */
    res.json(
      {
      code: 1,
      msg: '数据查找成功！',
      data: data.departs,
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
// // @desc   获取单个部门信息
// // @access Private

router.get(
  '/getByid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Depart.findOne({ _id: req.query.id })
      .then(depart => {
        if (!depart) {
          return res.json('没有任何内容');
        }

        res.json({
          code: 1,
          msg: '数据查找成功！',
          data: depart
        })
      })
      .catch(err => res.status(404).json(err));
  }
);



// // @route  POST api/projectinfo/delete/:id
// // @desc   删除部门信息接口
// // @access Private
router.get(
  '/remove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Depart.findOneAndRemove({ _id: req.query.id })
      .then(depart => {
        depart.save().then(depart => {
          res.json({
            code: 1,
            msg: '数据删除成功！',
            data: depart
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
// // @desc   多项删除部门信息接口
// // @access Private
router.post(
  '/batchRemove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.body.ids)
    Depart.remove({ _id: { $in: req.body.ids } })
      .then(depart => {
        res.json({
          code: 1,
          msg: '数据删除成功！',
          data: depart
        })
      })
      .catch(err => res.json({
        code: 0,
        msg: '数据删除失败！',
      }));
  }
);

module.exports = router;
