<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">{{ systemName }}</span>
      </div>
      <div class="desc">
        软件项目团队协作系统 是最便捷的 软件项目 团队协作系统
      </div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs
          size="large"
          :tabBarStyle="{ textAlign: 'center' }"
          style="padding: 0 2px"
        >
          <a-tab-pane tab="用户注册" key="2">
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="请输入真实姓名"
                v-decorator="[
                  'name',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请正确输入账户名',
                        whitespace: true,
                        max: 20,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="请输入用户名"
                v-decorator="[
                  'alias',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请正确输入账户名',
                        whitespace: true,
                        max: 20,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="请输入邮箱"
                v-decorator="[
                  'email',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请正确输入邮箱',
                        whitespace: true,
                        pattern: new RegExp('^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$'),
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="请输入密码"
                autocomplete="autocomplete"
                type="password"
                v-decorator="[
                  'password',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入6~16位密码',
                        whitespace: true,
                        max: 16,
                        min: 6,
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="请输入手机号"
                autocomplete="autocomplete"
                v-decorator="[
                  'phone',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入正确手机号',
                        whitespace: true,
                        pattern: new RegExp('^1[3|4|5|7|8][0-9]{9}$'),
                      },
                    ],
                  },
                ]"
              >
                <a-icon slot="prefix" type="mobile" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-row :gutter="8" style="margin: 0 -4px">
                <a-col :span="16">
                  <a-input
                    size="large"
                    placeholder="请输入手机验证码"
                    autocomplete="autocomplete"
                    v-decorator="[
                      'code',
                      {
                        rules: [
                          {
                            required: true,
                            message: '请输入六位手机验证码',
                            whitespace: true,
                            len: 6,
                          },
                        ],
                      },
                    ]"
                  >
                    <a-icon slot="prefix" type="mail" />
                  </a-input>
                </a-col>
                <a-col :span="8" style="padding-left: 4px">
                  <a-button
                    style="width: 100%"
                    class="captcha-button"
                    size="large"
                    @click="getcode"
                    :disabled="codeVal == '获取验证码' ? false : true"
                    >{{ codeVal }}</a-button
                  >
                </a-col>
              </a-row>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <a-form-item>
          <a-button
            :loading="logging"
            style="width: 100%; margin-top: 24px"
            size="large"
            htmlType="submit"
            type="primary"
            >注册</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
import { loginRegist } from "@/services/index";

export default {
  name: "Register",
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      error: "",
      form: this.$form.createForm(this),
      fields: {
        alias: "",
        password: "",
        phone: "",
        code: "",
      },
      codeVal: "获取验证码",
      getcodeTime: 10,
      clocktimer: null,
    };
  },
  computed: {
    systemName() {
      return this.$store.state.setting.systemName;
    },
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.logging = true;
          loginRegist.register(values).then(res=>{
            if(res.data.code==1){
              this.$message.success(res.data.msg)
              this.logging = false;
              this.$router.push("/login")
            }else{
              this.$message.error(res.data.msg)
              this.logging = false;
            }
          })
        }
      });
    },
    getcode() {
      let phone = this.form.getFieldValue("phone");
      let codereg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (codereg.test(phone)) {
        if (this.codeVal == "获取验证码") {
          loginRegist
            .getcode({ phone: phone})
            .then((res) => {
              this.$message.success('手机验证码发送成功请注意查收！')
              console.log(res);
              // if(res.data.code==1){
              //   console.log(res);
              //   alert("手机验证码发送成功请注意查收！")
              // }
            });
          this.clocktimer = setInterval(this.doLoop, 1000);
        } else {
          return false;
        }
      }else{
        this.$message.error('手机号错误！')
      }
    },
    doLoop() {
      // 倒计时
      this.getcodeTime--;
      if (this.getcodeTime > 0) {
        this.codeVal = this.getcodeTime + "s";
      } else {
        clearInterval(this.clocktimer);
        this.codeVal = "获取验证码";
        this.getcodeTime = 10; //重置时间
      }
    },
  },
};
</script>

<style lang="less" scoped>
.common-layout {
  .top {
    text-align: center;
    .header {
      height: 44px;
      line-height: 44px;
      a {
        text-decoration: none;
      }
      .logo {
        height: 44px;
        vertical-align: top;
        margin-right: 16px;
      }
      .title {
        font-size: 33px;
        color: @title-color;
        font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica,
          sans-serif;
        font-weight: 600;
        position: relative;
        top: 2px;
      }
    }
    .desc {
      font-size: 14px;
      color: @text-color-second;
      margin-top: 12px;
      margin-bottom: 40px;
    }
  }
  .login {
    width: 368px;
    margin: 0 auto;
    @media screen and (max-width: 576px) {
      width: 95%;
    }
    @media screen and (max-width: 320px) {
      .captcha-button {
        font-size: 14px;
      }
    }
    .icon {
      font-size: 24px;
      color: @text-color-second;
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }
  }
}
</style>
