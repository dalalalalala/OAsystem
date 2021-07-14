// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const ItemStep = require('../../models/ItemStep');



// @route  POST api/projectinfo/add
// @desc   创建项目信息接口
// @access Private
router.post(
  '/edit',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const itemStepFields = {};

    if (req.body.itemID) itemStepFields.itemID = req.body.itemID;
    if (req.body.title) itemStepFields.title = req.body.title;
    if (req.body.endTime) itemStepFields.endTime = req.body.endTime;
    if (req.body.status) itemStepFields.status = req.body.status;
    if (req.body.description) itemStepFields.description = req.body.description;
    if (req.body.content) itemStepFields.content = req.body.content;


    // 判断如果id不为空则为编辑，否则为修改
    if (req.body._id != '') {
      ItemStep.findOneAndUpdate(
        { _id: req.body._id },
        { $set: itemStepFields },
        { new: true }
      ).then(itemSteps => {
        res.json({
          code: 1,
          msg: '项目信息修改成功！',
          data: itemSteps
        })
      })
    } else {
      new ItemStep(itemStepFields).save().then(itemSteps => {
        res.json({
          code: 1,
          msg: '项目信息新增成功！',
          data: itemSteps
        });
      });
    }

  }
);

// @route  GET api/projectinfo
// @desc   获取所有项目信息
// @access Private

router.post('/list', passport.authenticate('jwt', { session: false }), function (req, res) {

  var data = {
    itemSteps: [],
    // 获取不到page时默认为打开在第一页
    page: Number(req.query.page || 1),
    limit: Number(req.query.size || 4),
    pages: 1,
    count: 0
  }
  // 根据项目id获取相应的项目步骤
  var dataParams = { itemID: req.body.itemID}
  for (let key in req.body) {
    if (req.body[key] != '') {
      dataParams[key] = req.body[key]
    }
  }

  ItemStep.find(dataParams).then((itemSteps) => {
    if (!itemSteps) {
      return res.json({
        code: 0,
        msg: '没有任何内容',
        count: itemSteps.length
      });
    }
    // data.itemSteps = itemSteps;
    // 获取读取内容的总记录
    return itemSteps.length
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

    return ItemStep.find(dataParams).limit(data.limit).skip(skip)
  }).then((itemSteps) => {
    data.itemSteps = itemSteps

    // console.log(data)
    /**最后渲染 */
    res.json(
      {
        code: 1,
        msg: '数据查找成功！',
        data: data.itemSteps,
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
// // @desc   获取单个项目信息
// // @access Private

router.get(
  '/getByid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    ItemStep.findOne({ _id: req.query.id })
      .then(itemStep => {
        if (!itemStep) {
          return res.json('没有任何内容');
        }

        res.json({
          code: 1,
          msg: '数据查找成功！',
          data: itemStep
        })
      })
      .catch(err => res.status(404).json(err));
  }
);



// // @route  POST api/projectinfo/delete/:id
// // @desc   删除项目信息接口
// // @access Private
router.get(
  '/remove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    ItemStep.findOneAndRemove({ _id: req.query.id })
      .then(itemStep => {
        itemStep.save().then(itemStep => {
          res.json({
            code: 1,
            msg: '数据删除成功！',
            data: itemStep
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
// // @desc   多项删除项目信息接口
// // @access Private
router.post(
  '/batchRemove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.body.ids)
    ItemStep.remove({ _id: { $in: req.body.ids } })
      .then(itemStep => {
        res.json({
          code: 1,
          msg: '数据删除成功！',
          data: itemStep
        })
      })
      .catch(err => res.json({
        code: 0,
        msg: '数据删除失败！',
      }));
  }
);

module.exports = router;
