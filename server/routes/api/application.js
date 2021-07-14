// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');

const Application = require('../../models/Application');


// @route  POST api/projectinfo/add
// @desc   创建审批信息接口
// @access Private
router.post(
  '/edit',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const applicationFields = {};

    applicationFields.applicant = req.user.name;
    if (req.body.approver) applicationFields.approver = req.body.approver;
    if (req.body.type) applicationFields.type = req.body.type;
    if (req.body.createTime) applicationFields.createTime = req.body.createTime;
    if (req.body.validity) applicationFields.validity = req.body.validity;
    if (req.body.beginValidity) applicationFields.beginValidity = req.body.beginValidity;
    if (req.body.endValidity) applicationFields.endValidity = req.body.endValidity;
    if (req.body.remarks) applicationFields.remarks = req.body.remarks;
    if (req.body.isapproved) applicationFields.isapproved = req.body.isapproved;

    // 判断如果id不为空则为编辑，否则为修改
    if (req.body._id != '') {
      Application.findOneAndUpdate(
        { _id: req.body._id },
        { $set: applicationFields },
        { new: true }
      ).then(applications => {
        res.json({
          code: 1,
          msg: '审批信息修改成功！',
          data: applications
        })
      })
    } else {
      new Application(applicationFields).save().then(applications => {
        res.json({
          code: 1,
          msg: '审批信息新增成功！',
          data: applications
        });
      });
    }

  }
);

// @route  POST api/projectinfo/add
// @desc   同意,不同意审批信息接口
// @access Private
router.post(
  '/editApprove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const applicationFields = {};

    applicationFields.approver = req.user.name;
    if (req.body.approver) applicationFields.approver = req.body.approver;
    if (req.body.type) applicationFields.type = req.body.type;
    if (req.body.createTime) applicationFields.createTime = req.body.createTime;
    if (req.body.validity) applicationFields.validity = req.body.validity;
    if (req.body.beginValidity) applicationFields.beginValidity = req.body.beginValidity;
    if (req.body.endValidity) applicationFields.endValidity = req.body.endValidity;
    if (req.body.remarks) applicationFields.remarks = req.body.remarks;
    if (req.body.isapproved) applicationFields.isapproved = req.body.isapproved;

      Application.findOneAndUpdate(
        { _id: req.body._id },
        { $set: applicationFields },
        { new: true }
      ).then(applications => {
        res.json({
          code: 1,
          msg: '审批成功！',
          data: applications
        })
      })
    

  }
);

// @route  POST api/projectinfo/add
// @desc   批量同意审批信息接口
// @access Private
router.post(
  '/batchApprove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    // const applicationFields = {};

    // applicationFields.approver = req.user.name;
    Application.updateMany({ _id: { $in: req.body.ids } }, { $set: { isapproved: "同意", approver: req.user.name } }).then(applications=>{
      res.json({
          code: 1,
          msg: '审批成功！',
          data: applications
      })

    })
   
        
  }
);

// @route  GET api/projectinfo
// @desc   获取所有审批信息
// @access Private

router.post('/list', passport.authenticate('jwt', { session: false }), function (req, res) {

  var data = {
    applications: [],
    // 获取不到page时默认为打开在第一页
    page: Number(req.query.page || 1),
    limit: Number(req.query.size || 4),
    pages: 1,
    count: 0
  }
  var dataParams ={}
  if (req.query.action == 'waitApprove'){
    // dataParams = { applicant: { $ne: req.user.name } }
    // 待我审批时，如果审批人为空则只能返回申请人==登录人数据，若审批人不为空则审批人==登录人就能返回(处理转接任务审批数据)
    dataParams = {}
  }else{
    dataParams = {applicant:req.user.name}
  }
  for (let key in req.body) {
    if (req.body[key] != '') {
      dataParams[key] = req.body[key]
    }
  }

  Application.find(dataParams).then((applications) => {

    if (!applications) {
      return res.json({
        code: 0,
        msg: '没有任何内容',
        count: applications.length
      });
    }

    // data.applications = applications;
    // 获取读取内容的总记录
    return applications
  }).then(applications=>{
    // 判断审批是否逾期未审批
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    let nowDate = [year, month, day].join('-');
    console.log('现在时间：',nowDate)

    // let nowDate = new Date().dateFormat.format("yyyy-MM-dd");
    if(applications.length>0){
      applications.forEach(item => {
      if (item.isapproved == '未处理' && nowDate>item.endValidity) {
        console.log(item.endValidity)
        console.log(nowDate)
        Application.findByIdAndUpdate({ _id: item._id}, {
          $set: { isapproved: "已逾期" }
        }).then(res=>{
          console.log(res)
        })
        console.log(item._id)
      }
    })
    }
 
    return applications
  }).then((applications) => {
    
    var applicationsData = applications
    if (req.query.action == 'waitApprove') {
      applicationsData = []
      if (req.user.operation == '三级权限') {
        applicationsData = applications
      } else if (req.user.operation == '二级权限') {
          applications.forEach(item => {
            if ((item.type == '请假' || item.type == '出差') && item.applicant != req.user.name) {
              // 获取请假、出差待审批消息
              applicationsData.push(item)
            } else if (item.approver != '' && item.approver == req.user.name) {
              // 获取别人的转接任务消息
              applicationsData.push(item)
            }
          })
        // })
        
      }
    }
    //为了方便,将总记录数存入data对象中
    data.count = applicationsData.length

    //计算总页数，向上取整数, 取最大值
    data.pages = Math.ceil(data.count / data.limit)
    // 页数取值不能超过总页数的值或小于1
    // Math.min(),Math.max()限制最小值最大值
    data.page = Math.min(data.page, data.pages)  //2
    data.page = Math.max(data.page, 1)  //2

    var skip = (data.page - 1) * data.limit

    return applicationsData = applicationsData.slice(skip, skip + data.limit)
    // return Application.find(dataParams).limit(data.limit).skip(skip)
  }).then((applications) => {

    // console.log(applications)
   
    data.applications = applications

    /**最后渲染 */
    res.json(
      {
        code: 1,
        msg: '数据查找成功！',
        data: data.applications,
        page: data.page,
        limit: data.limit,
        pages: data.pages,
        total: data.count
      }
    )
  }).catch(err => res.status(404).json(err));
})


// // @route  GET api/projectinfo/:id
// // @desc   获取单个审批信息
// // @access Private

router.get(
  '/getByid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Application.findOne({ _id: req.query.id })
      .then(application => {
        if (!application) {
          return res.json('没有任何内容');
        }

        res.json({
          code: 1,
          msg: '数据查找成功！',
          data: application
        })
      })
      .catch(err => res.status(404).json(err));
  }
);



// // @route  POST api/projectinfo/delete/:id
// // @desc   删除审批信息接口
// // @access Private
router.get(
  '/remove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Application.findOneAndRemove({ _id: req.query.id })
      .then(application => {
        application.save().then(application => {
          res.json({
            code: 1,
            msg: '数据删除成功！',
            data: application
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
// // @desc   多项删除审批信息接口
// // @access Private
router.post(
  '/batchRemove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req.body.ids)
    Application.remove({ _id: { $in: req.body.ids } })
      .then(application => {
        res.json({
          code: 1,
          msg: '数据删除成功！',
          data: application
        })
      })
      .catch(err => res.json({
        code: 0,
        msg: '数据删除失败！',
      }));
  }
);

module.exports = router;
