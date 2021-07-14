const express = require('express');
const router = express.Router();
const multer = require('multer')
const fs = require("fs")
const passport = require('passport');
const path = require('path')

const User = require('../../models/User');

var upload = multer({ dest: 'uploads/' })
// 图片上传
router.post('/uploadImg', upload.single('file'), function (req, res, next) {
  //读取文件路径(uploads/文件夹下面的新建的图片地址)
  fs.readFile(req.file.path, (err, data) => {
    //如果读取失败
    if (err) { return res.send('上传失败') }
    //如果读取成功
    //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
    let time = Date.now() + parseInt(Math.random() * 999) + parseInt(Math.random() * 2222);
    //拓展名
    let extname = req.file.mimetype.split('/')[1]
    //拼接成图片名
    let keepname = time + '.' + extname
    //三个参数
    //1.图片的绝对路径
    //2.写入的内容
    //3.回调函数
    fs.writeFile(path.join(__dirname, '../../public/img/' + keepname), data, (err) => {
      if (err) { 
        console.log(err)
        return res.json('写入失败') }
      res.json({ 
        code: 1, 
        msg: '上传ok',
        data: 'http://localhost:5001/public/img/' + keepname })
    });
  });
});

// router.post('/uploadImg',
//   multer({
//     //设置文件存储路径
//     dest: 'public/img'
//   }).array('file', 1), function (req, res, next) {
//     let files = req.files;
//     let file = files[0];
//     let fileInfo = {};
//     let path = 'public/img/' + Date.now().toString() + '_' + file.originalname;
//     fs.renameSync('./public/img/' + file.filename, path);
//     //获取文件基本信息
//     fileInfo.type = file.mimetype;
//     fileInfo.name = file.originalname;
//     fileInfo.size = file.size;
//     fileInfo.path = path;
//     res.json({
//       code: 1,
//       msg: 'OK',
//       data: fileInfo
//     })
//   });

// 编辑用户信息
router.post('/edit',
  passport.authenticate('jwt', { session: false }),//保证接口必须是登陆之后才能被访问
  (req, res) => {
    // console.log(req)
    personalParams = {
      alias: req.body.alias,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      avatar: req.body.avatar
    }
    User.findByIdAndUpdate(req.body.id , personalParams )
      .then(user => {
        // if (!User) {
        //   return res.status(404).json('没有任何内容');
        // }
        User.findById(req.user.id).then(user=>{
          res.json({
          code: 1,
          msg: '编辑个人信息成功！',
          data: user
        })
        })
        
      })
  }
);
module.exports = router;