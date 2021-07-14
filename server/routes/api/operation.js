// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const Operation = require('../../models/Operation');



// @route  POST api/projectinfo/add
// @desc   创建活动动态信息接口
// @access Private
router.post(
  '/edit',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const operationsFields = {};

    if (req.body.operator) operationsFields.operator = req.body.operator;
    if (req.body.operPlace) operationsFields.operPlace = req.body.operPlace;
    if (req.body.operAction) operationsFields.operAction = req.body.operAction;
    if (req.body.operContent) operationsFields.operContent = req.body.operContent;
    if (req.body.operContentId) operationsFields.operContentId = req.body.operContentId;
    if (req.body.avatar) operationsFields.avatar = req.body.avatar;
    if (req.body.operTime) operationsFields.operTime = req.body.operTime;



    // 判断如果id不为空则为编辑，否则为修改
    if (req.body._id != '') {
      Operation.findOneAndUpdate(
        { _id: req.body._id },
        { $set: operationsFields },
        { new: true }
      ).then(operations => {
        res.json({
          code: 1,
          msg: '活动动态信息修改成功！',
          data: operations
        })
      })
    } else {
      new Operation(operationsFields).save().then(operations => {
        res.json({
          code: 1,
          msg: '活动动态信息新增成功！',
          data: operations
        });
      });
    }

  }
);

// @route  GET api/projectinfo
// @desc   获取所有活动动态信息
// @access Private

router.post(
  '/list',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Operation.find()
      .then(operation => {
        if (!operation) {
          return res.json({
            code: 0,
            msg: '没有任何内容'
          });
        }
        res.json({
          code: 1,
          msg: '数据查找成功！',
          data: operation
        });
      })
      .catch(err => res.status(404).json(err));
  }
);

// router.post('/list', passport.authenticate('jwt', { session: false }), function (req, res) {

//   var data = {
//     operations: [],
//     // 获取不到page时默认为打开在第一页
//     page: Number(req.query.page || 1),
//     limit: Number(req.query.size || 4),
//     pages: 1,
//     count: 0
//   }
//   var dataParams = {}
//   for (let key in req.body) {
//     if (req.body[key] != '' && key != 'action') {
//       dataParams[key] = req.body[key]
//     }
//   }

//   Operation.find(dataParams).then((operations) => {
//     if (!operations) {
//       return res.json({
//         code: 0,
//         msg: '没有任何内容',
//         count: operations.length
//       });
//     }
//     // data.operations = operations;
//     // 获取读取内容的总记录
//     return operations.length
//   }).then((count) => {
//     //为了方便,将总记录数存入data对象中
//     data.count = count

//     if (req.body.action == 'allData') {
//       data.limit = count
//       data.page = 1
//     }

//     //计算总页数，向上取整数, 取最大值
//     data.pages = Math.ceil(data.count / data.limit)
//     // 页数取值不能超过总页数的值或小于1
//     // Math.min(),Math.max()限制最小值最大值
//     data.page = Math.min(data.page, data.pages)  //2
//     data.page = Math.max(data.page, 1)  //2

//     var skip = (data.page - 1) * data.limit

//     return Operation.find(dataParams).limit(data.limit).skip(skip)
//   }).then((operations) => {
//     data.operations = operations

//     // console.log(data)
//     /**最后渲染 */
//     res.json(
//       {
//         code: 1,
//         msg: '数据查找成功！',
//         data: data.operations,
//         page: data.page,
//         limit: data.limit,
//         pages: data.pages,
//         total: data.count,
//         aa: dataParams
//       }
//     )
//   }).catch(err => res.status(404).json(err));
// })


// // @route  GET api/projectinfo/:id
// // @desc   获取单个活动动态信息
// // @access Private

// 根据项目id获取项目步骤、项目任务动态
router.get(
  '/getByid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Operation.find({ operContentId: req.query.itemId, operPlace:{$ne:'在项目中'} })
      .then(operation => {
        if (!operation) {
          return res.json('没有任何内容');
        }

        res.json({
          code: 1,
          msg: '数据查找成功！',
          data: operation
        })
      })
      .catch(err => res.status(404).json(err));
  }
);



// // @route  POST api/projectinfo/delete/:id
// // @desc   删除活动动态信息接口
// // @access Private
router.get(
  '/remove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Operation.findOneAndRemove({ _id: req.query.id })
      .then(operation => {
        operation.save().then(operation => {
          res.json({
            code: 1,
            msg: '数据删除成功！',
            data: operation
          })
        });
      })
      .catch(err => res.json('删除失败!'));
  }
);

// // @route  POST api/projectinfo/delete/:id
// // @desc   多项删除活动动态信息接口
// // @access Private
router.post(
  '/batchRemove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.body.ids)
    Operation.remove({ _id: { $in: req.body.ids } })
      .then(operation => {
        res.json({
          code: 1,
          msg: '数据删除成功！',
          data: operation
        })
      })
      .catch(err => res.json('删除失败!'));
  }
);

module.exports = router;
