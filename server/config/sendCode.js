
const SMSClient = require('@alicloud/sms-sdk'); //导入模块


exports.send = function (phone, res) {
  /* GET users listing. */
  //初始化sms_client
  let smsClient = new SMSClient({
    accessKeyId: "xxxxxxx",
    secretAccessKey: "xxxxxxx"
  })

  //阿里云上的id和密钥//验证码
  var codes = "";
  for (let i = 0; i < 6; i++) {
    codes = codes + Math.floor(Math.random() * 10);
  }

  //发送短信
  if (phone != " ") { //手机号不为空
    // console.log(codes);
    smsClient.sendSMS({
      PhoneNumbers: phone,
      SignName: 'xxxxxx',
      TemplateCode: 'xxxxxx',
      TemplateParam: `{\"code\":\"${codes}\"}`
    }).then(function (res) {
      let { Code } = res
      if (Code === 'OK') {
        //处理返回参数
        console.log(res)
      }
    }, function (err) {
      console.log(err);
    });
    res.send('成功' + codes)
    return codes
  }

}