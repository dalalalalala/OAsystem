// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const User = require('../../models/User');



// @route  POST api/projectinfo/add
// @desc   创建人员信息接口
// @access Private
router.post(
  '/edit',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const usersFields = {};

    if (req.body.role) usersFields.role = req.body.role;
    if (req.body.operation) usersFields.operation = req.body.operation;

    // 判断如果id不为空则为编辑，否则为修改
    if (req.body._id != '') {
      User.findOneAndUpdate(
        { _id: req.body._id },
        { $set: usersFields },
        { new: true }
      ).then(users => {
        res.json({
          code: 1,
          msg: '人员信息修改成功！',
          data: users
        })
      })
    } else {
      new User(usersFields).save().then(users => {
        res.json({
          code: 1,
          msg: '人员信息新增成功！',
          data: users
        });
      });
    }

  }
);

// @route  GET api/projectinfo
// @desc   获取所有人员信息
// @access Private

router.post('/list', passport.authenticate('jwt', { session: false }), function (req, res) {
  var data = {
    users: [],
    // 获取不到page时默认为打开在第一页
    page: Number(req.query.page || 1),
    limit: Number(req.query.size || 4),
    pages: 1,
    count: 0
  }
  
  var dataParams={}
  if (req.body.action==undefined||req.body.action==null){
    dataParams = {email:{$ne:req.user.email}}
    if(req.user.operation=='二级权限'){
      dataParams = { email: { $ne: req.user.email },operation:'一级权限' }
    }
  }
  
  for (let key in req.body) {
    if (req.body[key] != ''&&key != 'action') {
        dataParams[key] = req.body[key]
    }
  }
  User.find(dataParams).then((users) => {
    if (!users) {
      return res.json({
        code: 0,
        msg: '没有任何内容',
        count: users.length
      });
    }
    // data.users = users;
    // 获取读取内容的总记录
    return users.length
  }).then((count) => {
    //为了方便,将总记录数存入data对象中
    data.count = count

    //如果有memberOptions标识符，则不分页
    if (req.body.action == 'memberOptions' || req.body.action== 'projectInfo' ) {
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

    return User.find(dataParams).limit(data.limit).skip(skip)
  }).then((users) => {
    data.users = users

    /**最后渲染 */
    res.json(
      {
        code: 1,
        msg: '数据查找成功！',
        data: data.users,
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
// // @desc   获取单个人员信息
// // @access Private

router.get(
  '/getByid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findOne({ _id: req.query.id })
      .then(item => {
        if (!item) {
          return res.json('没有任何内容');
        }

        res.json({
          code: 1,
          msg: '数据查找成功！',
          data: item
        })
      })
      .catch(err => res.status(404).json(err));
  }
);



// // @route  POST api/projectinfo/delete/:id
// // @desc   删除人员信息接口
// // @access Private
router.get(
  '/remove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    User.findOneAndRemove({ _id: req.query.id })
      .then(user => {
        user.save().then(user => {
          res.json({
            code: 1,
            msg: '数据删除成功！',
            data: user
          })
        });
      })
      .catch(err => res.json({
        code: 0,
        msg: '数据删除失败',
      }));
  }
);

// // @route  POST api/projectinfo/delete/:id
// // @desc   多项删除人员信息接口
// // @access Private
router.post(
  '/batchRemove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.body.ids)
    User.remove({ _id: { $in: req.body.ids } })
      .then(item => {
        res.json({
          code: 1,
          msg: '数据删除成功！',
          data: item
        })
      })
      .catch(err => res.json({
        code: 0,
        msg: '数据删除失败！',
      }));
  }
);

module.exports = router;
