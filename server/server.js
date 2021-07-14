const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const app = express();
const path = require('path')

// 引入users.js
const users = require('./routes/api/users');
const profiles = require('./routes/api/profiles');
const personal = require('./routes/api/personal');
const projectinfo = require('./routes/api/projectinfo');
const personinfo = require('./routes/api/personinfo');
const institution = require('./routes/api/institution');
const role = require('./routes/api/role');
const limit = require('./routes/api/limit');
const note = require('./routes/api/note');
const itemStep = require('./routes/api/itemStep');
const application = require('./routes/api/application');
const task = require('./routes/api/task');
const operation = require('./routes/api/operation');

// DB config
const db = require('./config/keys').mongoURI;

app.use('/public/', express.static(path.join(__dirname, '/public/')))
// 使用body-parser中间件
//请求会先经过body-parser加工一下,从而使后端可以获得请求体
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Connect to mongodb
mongoose
  .connect(
    db,
    { useNewUrlParser: true,
      useFindAndModify:false }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// passport 初始化
//用来验证用户名密码
app.use(passport.initialize());

require('./config/passport')(passport);

// app.get("/",(req,res) => {
//   res.send("Hello World!");
// })

// 使用routes
//第一个参数，是根url
app.use('/api/users', users);
app.use('/api/profiles', profiles);
app.use('/api/personal', personal);
app.use('/api/projectinfo', projectinfo);
app.use('/api/personinfo', personinfo);
app.use('/api/institution', institution);
app.use('/api/role', role);
app.use('/api/limit', limit);
app.use('/api/note', note);
app.use('/api/itemStep', itemStep);
app.use('/api/application', application);
app.use('/api/task', task);
app.use('/api/operation', operation);

const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
