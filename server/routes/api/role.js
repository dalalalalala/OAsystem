// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const Role = require('../../models/Role');



// @route  POST api/projectinfo/add
// @desc   创建角色信息接口
// @access Private
router.post(
  '/edit',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const rolesFields = {};

    if (req.body.type) rolesFields.type = req.body.type;
    if (req.body.name) rolesFields.name = req.body.name;
    if (req.body.departId) rolesFields.departId = req.body.departId;
    if (req.body.operation) rolesFields.operation = req.body.operation;
    if (req.body.roleDesc) rolesFields.roleDesc = req.body.roleDesc;


    // 判断如果id不为空则为编辑，否则为修改
    if (req.body._id != '') {
      Role.findOneAndUpdate(
        { _id: req.body._id },
        { $set: rolesFields },
        { new: true }
      ).then(roles => {
        res.json({
          code: 1,
          msg: '角色信息修改成功！',
          data: roles
        })
      })
    } else {
      new Role(rolesFields).save().then(roles => {
        res.json({
          code: 1,
          msg: '角色信息新增成功！',
          data: roles
        });
      });
    }

  }
);

// @route  GET api/projectinfo
// @desc   获取所有角色信息
// @access Private

router.post('/list', passport.authenticate('jwt', { session: false }), function (req, res) {

  var data = {
    roles: [],
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

  Role.find(dataParams).then((roles) => {
    if (!roles) {
      return res.json({
        code: 0,
        msg: '没有任何内容',
        count: roles.length
      });
    }
    // data.roles = roles;
    // 获取读取内容的总记录
    return roles.length
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

    return Role.find(dataParams).limit(data.limit).skip(skip)
  }).then((roles) => {
    data.roles = roles

    // console.log(data)
    /**最后渲染 */
    res.json(
      {
        code: 1,
        msg: '数据查找成功！',
        data: data.roles,
        page: data.page,
        limit: data.limit,
        pages: data.pages,
        total: data.count,
        aa: dataParams
      }
    )
  }).catch(err => res.status(404).json(err));
})

// router.get(
//   '/list',
//   passport.authenticate('jwt', { session: false }),//保证接口必须是登陆之后才能被访问
//   (req, res) => {
//     Role.find()
//       .then(roles => {
//         if (!roles) {
//           return res.json({
//             code: 0,
//             msg: '没有任何内容'
//           });
//         }
//         console.log(roles[0].endTime)
//         res.json({
//           code: 1,
//           msg: '数据查找成功！',
//           data: roles
//         });
//       })
//       .catch(err => res.status(404).json(err));
//   }
// );

// // @route  GET api/projectinfo/:id
// // @desc   获取单个角色信息
// // @access Private

router.get(
  '/getByid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Role.findOne({ _id: req.query.id })
      .then(role => {
        if (!role) {
          return res.json('没有任何内容');
        }

        res.json({
          code: 1,
          msg: '数据查找成功！',
          data: role
        })
      })
      .catch(err => res.status(404).json(err));
  }
);



// // @route  POST api/projectinfo/delete/:id
// // @desc   删除角色信息接口
// // @access Private
router.get(
  '/remove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Role.findOneAndRemove({ _id: req.query.id })
      .then(role => {
        role.save().then(role => {
          res.json({
            code: 1,
            msg: '数据删除成功！',
            data: role
          })
        });
      })
      .catch(err => res.json('删除失败!'));
  }
);

// // @route  POST api/projectinfo/delete/:id
// // @desc   多项删除角色信息接口
// // @access Private
router.post(
  '/batchRemove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.body.ids)
    Role.remove({ _id: { $in: req.body.ids } })
      .then(role => {
        res.json({
          code: 1,
          msg: '数据删除成功！',
          data: role
        })
      })
      .catch(err => res.json('删除失败!'));
  }
);

// // @route  POST api/projectinfo/delete/:id
// // @desc   多项新增角色信息接口
// // @access Private
router.post(
  '/batchAdd',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.body.dataParams)
    // res.json({
    //   data: req.body.dataParams
    // })
    Role.insertMany(req.body.dataParams)
      .then(role => {
        res.json({
          code: 1,
          msg: '数据批量新增成功！',
          data: role
        })
      })
      .catch(err => res.json('批量新增失败!'));
  }
);

module.exports = router;
