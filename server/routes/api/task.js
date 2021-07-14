// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const Task = require('../../models/Task');



// @route  POST api/projectinfo/add
// @desc   创建任务信息接口
// @access Private
router.post(
  '/edit',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const taskFields = {};

    if (req.body.taskName) taskFields.taskName = req.body.taskName;
    if (req.body.itemId) taskFields.itemId = req.body.itemId;
    if (req.body.itemStepId) taskFields.itemStepId = req.body.itemStepId;
    if (req.body.member) taskFields.member = req.body.member;
    if (req.body.endTime) taskFields.endTime = req.body.endTime;
    if (req.body.taskPer) {
      taskFields.taskPer = req.body.taskPer
    }else{
      taskFields.taskPer = 0
    }
    if (req.body.isBegin) taskFields.isBegin = req.body.isBegin;
    if (req.body.isOverdue) taskFields.isOverdue = req.body.isOverdue;
    if (req.body.isFinish) taskFields.isFinish = req.body.isFinish;
    if (req.body.content) taskFields.content = req.body.content;
    
    console.log('当前完成度：',req.body.taskPer)
    console.log(taskFields)
    // 判断如果id不为空则为编辑，否则为修改
    if (req.body._id != '') {
      Task.findOneAndUpdate(
        { _id: req.body._id },
        { $set: taskFields },
        { new: true }
      ).then(tasks => {
        res.json({
          code: 1,
          msg: '任务信息修改成功！',
          data: tasks
        })
      })
    } else {
      new Task(taskFields).save().then(tasks => {
        res.json({
          code: 1,
          msg: '任务信息新增成功！',
          data: tasks
        });
      });
    }

  }
);

// @route  GET api/projectinfo
// @desc   获取所有任务信息
// @access Private

router.post('/list', passport.authenticate('jwt', { session: false }), function (req, res) {

  var data = {
    tasks: [],
    // 获取不到page时默认为打开在第一页
    page: Number(req.query.page || 1),
    limit: Number(req.query.size || 4),
    pages: 1,
    count: 0
  }
  var dataParams = {}
  for (let key in req.body) {
    if (req.body[key] != '') {
      dataParams[key] = req.body[key]
    }
  }

  Task.find(dataParams).then((tasks) => {
    if (!tasks) {
      return res.json({
        code: 0,
        msg: '没有任何内容',
        count: tasks.length
      });
    }
    // data.tasks = tasks;
    // 获取读取内容的总记录
    return tasks.length
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

    return Task.find(dataParams).limit(data.limit).skip(skip)
  }).then((tasks) => {
    data.tasks = tasks

    // console.log(data)
    /**最后渲染 */
    res.json(
      {
        code: 1,
        msg: '数据查找成功！',
        data: data.tasks,
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
// // @desc   根据项目id及用户姓名获取项目任务信息
// // @access Private

router.post(
  '/getByitemAndUser',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log('项目id：',req.body.itemId)
    Task.find({ itemId: req.body.itemId, member: req.body.member })
      .then(task => {
        if (!task) {
          return res.json('没有任何内容');
        }

        res.json({
          code: 1,
          msg: '数据查找成功！',
          data: task
        })
      })
      .catch(err => res.status(404).json(err));
  }
);


// // @route  GET api/projectinfo/:id
// // @desc   根据登录人获取所有的总任务数量
// // @access Private

// router.get(
//   '/getByitemAndUser',
//   passport.authenticate('jwt', { session: false }),
//   (req, res) => {
//     console.log('项目id：', req.query.itemId)
//     Task.find({ itemId: req.query.itemId, member: req.user.name })
//       .then(task => {
//         if (!task) {
//           return res.json('没有任何内容');
//         }

//         res.json({
//           code: 1,
//           msg: '数据查找成功！',
//           data: task
//         })
//       })
//       .catch(err => res.status(404).json(err));
//   }
// );


// // @route  GET api/projectinfo/:id
// // @desc   获取单个任务信息
// // @access Private

router.get(
  '/getByid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Task.findOne({ _id: req.query.id })
      .then(task => {
        if (!task) {
          return res.json('没有任何内容');
        }

        res.json({
          code: 1,
          msg: '数据查找成功！',
          data: task
        })
      })
      .catch(err => res.status(404).json(err));
  }
);



// // @route  POST api/projectinfo/delete/:id
// // @desc   删除任务信息接口
// // @access Private
router.get(
  '/remove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Task.findOneAndRemove({ _id: req.query.id })
      .then(task => {
        task.save().then(task => {
          res.json({
            code: 1,
            msg: '数据删除成功！',
            data: task
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
// // @desc   多项删除任务信息接口
// // @access Private
router.post(
  '/batchRemove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.body.ids)
    Task.remove({ _id: { $in: req.body.ids } })
      .then(task => {
        res.json({
          code: 1,
          msg: '数据删除成功！',
          data: task
        })
      })
      .catch(err => res.json({
        code: 0,
        msg: '数据删除失败！',
      }));
  }
);

module.exports = router;
