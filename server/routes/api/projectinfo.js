// @login & register
const express = require('express');
const router = express.Router();
const passport = require('passport');
const moment = require('moment');

const Items = require('../../models/Items');



// @route  POST api/projectinfo/add
// @desc   创建项目信息接口
// @access Private
router.post(
  '/edit',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const itemsFields = { createName: req.user.name};

    if (req.body.itemName) itemsFields.itemName = req.body.itemName;
    if (req.body.userName) itemsFields.userName = req.body.userName;
    if (req.body.type) itemsFields.type = req.body.type;
    if (req.body.duty) itemsFields.duty = req.body.duty;
    if (req.body.endTime) itemsFields.endTime = req.body.endTime;
    if (req.body.fileName || req.body.fileName=='') itemsFields.fileName = req.body.fileName;
    if (req.body.filePath || req.body.filePath=='') itemsFields.filePath = req.body.filePath;

    if (req.body.itemPer) {
      itemsFields.itemPer = req.body.itemPer
    } else {
      itemsFields.itemPer = 0
    }
    if (req.body.isBegin) itemsFields.isBegin = req.body.isBegin;
    // 判断如果id不为空则为编辑，否则为修改
    if(req.body._id!=''){
          Items.findOneAndUpdate(
            { _id: req.body._id },
            { $set: itemsFields },
            { new: true }
          ).then(items => {res.json({
            code: 1,
            msg: '项目信息修改成功！',
            data: items
          })
        })
    }else{
      new Items(itemsFields).save().then(items => {
      res.json({
        code:1,
        msg:'项目信息新增成功！',
        data:items
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
    items: [],
    // 获取不到page时默认为打开在第一页
    page: Number(req.query.page || 1),
    limit: Number(req.query.size || 4),
    pages: 1,
    count: 0
  }

  var dataParams={}
  for(let key in req.body){
    if (req.body[key]!=''){
      dataParams[key]=req.body[key]
    }
  }

  Items.find(dataParams).then((items) => {
    if (!items) {
      return res.json({
        code: 0,
        msg: '没有任何内容',
        count: items.length
      });
    }
    // data.items = items;
    // 获取读取内容的总记录
    return items
  }).then((items) => {
    var itemDatas = items
    if (req.user.operation!='三级权限'){
      itemDatas = []
      for(let item of items){
        item.userName.find(userItem=>{
          if(userItem.name==req.user.name){
            itemDatas.push(item)
            console.log(itemDatas)
          }
        })
      }

    }
    console.log(req.user.operation)

    //为了方便,将总记录数存入data对象中
    data.count = itemDatas.length

    //计算总页数，向上取整数, 取最大值
    data.pages = Math.ceil(data.count / data.limit)
    // 页数取值不能超过总页数的值或小于1
    // Math.min(),Math.max()限制最小值最大值
    data.page = Math.min(data.page, data.pages)  //2
    data.page = Math.max(data.page, 1)  //2

    var skip = (data.page - 1) * data.limit

    return itemDatas.slice(skip, skip + data.limit)
    // return Items.find(dataParams).limit(data.limit).skip(skip)
  }).then((items) => {
    data.items = items

    data.items.endTime = moment(data.items.endTime).format("'YYYY-MM-DD'")
    data.items.createTime = moment(data.items.createTime).format("'YYYY-MM-DD'")

    /**最后渲染 */
    res.json(
      {
        code: 1,
        msg: '数据查找成功！',
        data: data.items,
        page: data.page,
        limit: data.limit,
        pages: data.pages,
        total: data.count
      }
    )
  }).catch(err => res.status(404).json(err));
})

// // @route  GET api/projectinfo/:id
// // @desc   获取单个项目信息
// // @access Private

router.get(
  '/getByuserName',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Items.find()
    .then(item => {
        if (!item) {
          return res.json('没有任何内容');
        }
        let itemByuserName = []
        item.forEach(project=>{
          project.userName.forEach(member=>{
            if (member.email==req.user.email){
              itemByuserName.push(project)
            }
          })
        })

        res.json({
          code: 1,
          msg: '数据查找成功！',
          data: itemByuserName,  
          total: itemByuserName.length
        })
      })
      .catch(err => res.status(404).json(err));
  }
);


// // @route  GET api/projectinfo/:id
// // @desc   获取单个项目信息
// // @access Private

router.get(
  '/getByid',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Items.findOne({ _id: req.query.id })
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
// // @desc   删除项目信息接口
// // @access Private
router.get(
  '/remove',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Items.findOneAndRemove({ _id: req.query.id })
      .then(item => {
        item.save().then(item => {
          res.json({
            code: 1,
            msg: '数据删除成功！',
            data: item
          })
        });
      })
      .catch(err => res.json('删除失败!'));
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
    Items.remove({ _id: {$in:req.body.ids} })
      .then(item => {
          res.json({
            code: 1,
            msg: '数据删除成功！',
            data: item
          })
      })
      .catch(err => res.json('删除失败!'));
  }
);

module.exports = router;
