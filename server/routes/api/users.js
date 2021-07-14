// @login & register
const express = require('express');
const router = express.Router();
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const keys = require('../../config/keys');
const passport = require('passport');

const sendCode = require('../../config/sendCode');

const User = require('../../models/User');
const Code = require('../../models/Code');
const Task = require('../../models/Task');


// @route  GET api/users/test
// @desc   返回的请求的json数据
// @access public
router.get('/test', (req, res) => {
  res.json({ msg: 'login works' });
});

router.post('/getcode', (req, res) => {
  var phone = req.body.phone
  console.log(phone)
  
  Code.deleteMany({ phone: phone }).then(data => {
    console.log(data)
    var code = sendCode.send(phone,res)
    // var code = '223324'
    console.log('验证码' + code)
    return code
  }).then(code=>{
    new Code({
      phone: phone,
      code: code,
    }).save().then(data => {
      res.json({
        success: true,
        code: 1,
        msg: '验证码发送成功'
      });
    })
  })
 
});

// @route  POST api/users/register
// @desc   返回的请求的json数据
// @access public
router.post('/register', (req, res) => {
  // 查询验证码是否正确
  Code.findOne({ phone: req.body.phone }).then(codedata => {
    if (!codedata || codedata.code != req.body.code) {
      return res.json({
        code: -1,
        msg: '手机验证码错误!'
      });
    } else {
      // 查询数据库中是否拥有邮箱
      User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] }).then(user => {
        if (!user) {
          const avatar = gravatar.url(req.body.email, {
            s: '200',
            r: 'pg',
            d: 'mm'
          });

          const newUser = new User({
            name: req.body.name,
            email: req.body.email,
            avatar: avatar,
            password: req.body.password,
            alias: req.body.alias,
            code: req.body.code,
            phone: req.body.phone
          });
          newUser
            .save()
            .then(user => res.json({
              code: 1,
              msg: '注册成功！',
              data: user
            }))
            .catch(err => console.log(err));
        } else if (user.email == req.body.email && user.phone != req.body.phone) {
          return res.json({
            code: -1,
            msg: '邮箱已被注册!'
          });
        } else if (user.phone == req.body.phone && user.email != req.body.email) {
          return res.json({
            code: -1,
            msg: '手机号已被注册!'
          });
        } else if (user.phone == req.body.phone && user.email == req.body.email) {
          return res.json({
            code: -1,
            msg: '手机号与邮箱已被注册!'
          });
        }
        // else {

        //对密码进行一层加密，密文存入数据库中，然后登陆时比对密文即可
        // bcrypt.genSalt(10, function(err, salt) {
        //   bcrypt.hash(newUser.password, salt, (err, hash) => {
        //     if (err) throw err;

        //     newUser.password = hash;

        //     newUser
        //       .save()
        //       .then(user => res.json(user))
        //       .catch(err => console.log(err));
        //   });
        // });
        // }
      });
    }
  })

});

// @route  POST api/users/login
// @desc   返回token jwt passport
// @access public
router.post('/codecheck',(req,res)=>{
  // 验证验证码是否正确
  Code.findOne({ phone: req.body.phone }).then(codedata => {
    if (!codedata || codedata.code != req.body.code) {
      return res.json({
        code: -1,
        msg: '手机验证码错误!'
      });
    } else {
      User.findOneAndUpdate({ phone: req.body.phone }, { $set: { code: req.body.code } }, {}, function (err, data) {
        return res.json({
          code: 1,
        });
      })
    }

  })
})
router.post('/login', (req, res) => {
  // const email = req.body.name;
  // const password = req.body.password;
  // 查询数据库
  var loginParams
  if(req.body.action=='email'){
    loginParams = {email:req.body.email}
  }else{
    loginParams = {phone:req.body.phone}
  }
  User.findOne(loginParams).then(user => {
    if (!user) {
      return res.json({
        code: -1,
        msg: '用户名不存在!'
      });
    }
    console.log(user.code,req.body.code)
    if (user.password === req.body.password||user.code ==req.body.code) {
      Task.find({member:user.name}).then(tasks=>{
        const rule = {
          id: user.id,
          name: user.name,
          alias: user.alias,
          role: user.role,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          operation: user.operation,
          tasksTotal:tasks.length,
          position: 0
        };
        //匹配成功返回一个token
        jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          if (err) throw err;
          expireAt = new Date().toLocaleString()
          res.json({
            success: true,
            code: 1,
            data: {
              expireAt,
              user: rule,
              token: token,
            },
            msg: '登陆成功！'
          });
        });
      })
      
    } else {
        return res.json({
          code:-1,
          msg: '密码错误!'
        });
    }
    // 密码匹配
    // bcrypt.compare(password, user.password).then(isMatch => {
    //   if (isMatch) {
    //     const rule = {
    //       id: user.id,
    //       name: user.name,
    //       avatar: user.avatar,
    //       identity: user.identity
    //     };
    //   //匹配成功返回一个token
    //     jwt.sign(rule, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
    //       if (err) throw err;
    //       res.json({
    //         success: true,
    //         token: 'Bearer ' + token
    //       });
    //     });
    //     // res.json({msg:"success"});
    //   } else {
    //     return res.json('密码错误!');
    //   }
    // });
  });
});

// @route  GET api/users/current
// @desc   return current user
// @access Private
router.get(
  '/current',
  //调用passport
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //把passport解析出来的user信息给客户端
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      identity: req.user.identity
    });
  }
);

module.exports = router;
