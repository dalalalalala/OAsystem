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
          @change="tabchange"
          :tabBarStyle="{ textAlign: 'center' }"
          style="padding: 0 2px"
        >
          <a-tab-pane tab="账户密码登录" key="email">
            <a-alert
              type="error"
              :closable="true"
              v-show="error"
              :message="error"
              showIcon
              style="margin-bottom: 24px"
            />
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
                        message: '请输入邮箱',
                        whitespace: true,
                        pattern: new RegExp(
                          '^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$'
                        ),
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
                placeholder="请输入6~16位密码"
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
          </a-tab-pane>
          <a-tab-pane tab="手机号登录" key="phone">
            <a-form-item>
              <a-input
                size="large"
                placeholder="请输入手机号"
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
                    placeholder="请输入六位手机验证码"
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
        <div>
          <a-checkbox :checked="true">自动登录</a-checkbox>
          <div style="float: right">
            <!-- <a style="margin-right: 10px">忘记密码</a> -->
            <a @click="register">注册</a>
          </div>
        </div>
        <a-form-item>
          <a-button
            :loading="logging"
            style="width: 100%; margin-top: 24px"
            size="large"
            htmlType="submit"
            type="primary"
            >登录</a-button
          >
        </a-form-item>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from "@/layouts/CommonLayout";
// import { login} from "@/services/user";
import { loginRegist } from "@/services/index";
import { setAuthorization } from "@/utils/request";
import { loadRoutes } from "@/utils/routerUtil";
import { mapMutations } from "vuex";

export default {
  name: "Login",
  components: { CommonLayout },
  data() {
    return {
      logging: false,
      error: "",
      form: this.$form.createForm(this),
      loginaction: "email",
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
    ...mapMutations("account", ["setUser", "setPermissions", "setRoles"]),
    tabchange(value) {
      if (value == "phone") {
        this.loginaction = "phone";
      } else {
        this.loginaction = "email";
      }
      console.log(value);
    },
    onSubmit(e) {
      e.preventDefault();
      console.log(e);
      let valifields = [];
      if (this.loginaction == "phone") {
        valifields = ["phone", "code"];
      } else {
        valifields = ["email", "password"];
      }
      this.form.validateFields(valifields, (err, values) => {
        if (!err) {
          values.action = this.loginaction;
          console.log(values);
          if (this.loginaction == "phone") {
            loginRegist.codecheck(values).then((res) => {
              if (res.data.code == 1) {
                loginRegist.login(values).then(this.afterLogin);
              }else{
                this.$message.error(res.data.msg)
              }
            });
          } else {
            loginRegist.login(values).then(this.afterLogin);
          }
        }
      });
    },
    afterLogin(res) {
      console.log(res);
      this.logging = false;
      const loginRes = res.data;
      if (loginRes.code == 1) {
        console.log(res);
        const { user } = loginRes.data;
        let permissions = [
          { id: "form", operation: ["add", "edit", "delete"] },
        ];
        let roles = [{ id: "admin", operation: ["add", "edit", "delete"] }];
        this.setUser(user);
        this.setPermissions(permissions);
        this.setRoles(roles);
        setAuthorization({
          token: loginRes.data.token,
          expireAt: new Date(loginRes.data.expireAt),
        });
        // 获取路由配置
        // getRoutesConfig().then(result => {
        //   const routesConfig = result.data.data
        //   loadRoutes(routesConfig)
        //   this.$router.push('/dashboard/workplace')
        //   this.$message.success(loginRes.message, 3)
        // })
        console.log('当前权限：',user.operation)
        let routerData
        if(user.operation=="三级权限"){
          routerData = {
          code: 1,
          msg: "success",
          data: [
            {
              router: "taskwork",
              name: "任务管理",
              path: "taskwork",
              icon: "experiment",
              children: [
                {
                  router: "mytask",
                  name: "我的任务",
                  path: "mytask",
                  icon: null,
                  children: [],
                },
                {
                  router: "teamtask",
                  name: "队员任务",
                  path: "teamtask",
                  icon: null,
                  children: [],
                },
                {
                  router: "taskcom",
                  name: "任务完成度",
                  path: "taskcom",
                  icon: null,
                  children: [],
                },
              ],
            },
            {
              router:"personal",
              name:"个人中心",
              path:"personal",
            },
            {
              router: "teamwork",
              name: "团队管理",
              path: "teamwork",
              icon: "dot-chart",
              children: [
                {
                  router: "institution",
                  name: "组织机构",
                  path: "institution",
                  icon: null,
                  children: [],
                },
                {
                  router: "personinfo",
                  name: "人员信息",
                  path: "personinfo",
                  icon: null,
                  children: [],
                },
                {
                  router: "roleinfo",
                  name: "角色信息",
                  path: "roleinfo",
                  icon: null,
                  children: [],
                },
                {
                  router: "limit",
                  name: "权限管理",
                  path: "limit",
                  icon: null,
                  children: [],
                },
              ],
            },
            {
              router: "projectwork",
              name: "项目管理",
              path: "projectwork",
              icon: "alert",
              children: [
                {
                  router: "projectinfo",
                  name: "项目信息",
                  path: "projectinfo",
                  icon: null,
                  children: [],
                },
                {
                  router: "projectcom",
                  name: "项目完成度",
                  path: "projectcom",
                  icon: null,
                  children: [],
                },
                 {
                  router: "assignTask",
                  name: "派发任务",
                  path: "assignTask",
                  icon: null,
                  children: [],
                },
              ],
            },

            {
              router: "approval",
              name: "审批管理",
              path: "approval",
              icon: "radar-chart",
              children: [
                {
                  router: "myApprove",
                  name: "我的审批",
                  path: "myApprove",
                  icon: null,
                },
                {
                  router: "waitApprove",
                  name: "待我审批",
                  path: "waitApprove",
                  icon: null,
                },
              ],
            },
            {
              router: "systeminfo",
              name: "系统信息",
              path: "systeminfo",
              icon: "carry-out",
              children: [
                {
                  router: "approvalnotice",
                  name: "审批单信息",
                  path: "approvalnotice",
                  icon: null,
                  children: [],
                },
                {
                  router: "operatetask",
                  name: "操作任务信息",
                  path: "operatetask",
                  icon: null,
                  children: [],
                },
              ],
            },
          ],
          }
        }else if(user.operation=="二级权限"){
          routerData = {
          code: 1,
          msg: "success",
          data: [
            {
              router: "taskwork",
              name: "任务管理",
              path: "taskwork",
              icon: "experiment",
              children: [
                {
                  router: "mytask",
                  name: "我的任务",
                  path: "mytask",
                  icon: null,
                  children: [],
                },
                {
                  router: "teamtask",
                  name: "队员任务",
                  path: "teamtask",
                  icon: null,
                  children: [],
                },
                {
                  router: "taskcom",
                  name: "任务完成度",
                  path: "taskcom",
                  icon: null,
                  children: [],
                },
              ],
            },
            {
              router:"personal",
              name:"个人中心",
              path:"personal",
            },
            {
              router: "teamwork",
              name: "团队管理",
              path: "teamwork",
              icon: "dot-chart",
              children: [
                {
                  router: "personinfo",
                  name: "人员信息",
                  path: "personinfo",
                  icon: null,
                  children: [],
                },
                {
                  router: "roleinfo",
                  name: "角色信息",
                  path: "roleinfo",
                  icon: null,
                  children: [],
                },
              ],
            },
            {
              router: "projectwork",
              name: "项目管理",
              path: "projectwork",
              icon: "alert",
              children: [
                {
                  router: "projectinfo",
                  name: "项目信息",
                  path: "projectinfo",
                  icon: null,
                  children: [],
                },
                {
                  router: "projectcom",
                  name: "项目完成度",
                  path: "projectcom",
                  icon: null,
                  children: [],
                },
                 {
                  router: "assignTask",
                  name: "派发任务",
                  path: "assignTask",
                  icon: null,
                  children: [],
                },
              ],
            },

            {
              router: "approval",
              name: "审批管理",
              path: "approval",
              icon: "radar-chart",
              children: [
                {
                  router: "myApprove",
                  name: "我的审批",
                  path: "myApprove",
                  icon: null,
                },
                {
                  router: "waitApprove",
                  name: "待我审批",
                  path: "waitApprove",
                  icon: null,
                },
              ],
            },
            {
              router: "systeminfo",
              name: "系统信息",
              path: "systeminfo",
              icon: "carry-out",
              children: [
                {
                  router: "approvalnotice",
                  name: "审批单信息",
                  path: "approvalnotice",
                  icon: null,
                  children: [],
                },
                {
                  router: "operatetask",
                  name: "操作任务信息",
                  path: "operatetask",
                  icon: null,
                  children: [],
                },
              ],
            },
          ],
          }
        }else if(user.operation=="一级权限"){
          routerData = {
          code: 1,
          msg: "success",
          data: [
            {
              router: "taskwork",
              name: "任务管理",
              path: "taskwork",
              icon: "experiment",
              children: [
                {
                  router: "mytask",
                  name: "我的任务",
                  path: "mytask",
                  icon: null,
                  children: [],
                },
                {
                  router: "teamtask",
                  name: "队员任务",
                  path: "teamtask",
                  icon: null,
                  children: [],
                },
                {
                  router: "taskcom",
                  name: "任务完成度",
                  path: "taskcom",
                  icon: null,
                  children: [],
                },
              ],
            },
            {
              router:"personal",
              name:"个人中心",
              path:"personal",
            },
            {
              router: "projectwork",
              name: "项目管理",
              path: "projectwork",
              icon: "alert",
              children: [
                {
                  router: "projectinfo",
                  name: "项目信息",
                  path: "projectinfo",
                  icon: null,
                  children: [],
                },
                {
                  router: "projectcom",
                  name: "项目完成度",
                  path: "projectcom",
                  icon: null,
                  children: [],
                },
                 {
                  router: "assignTask",
                  name: "派发任务",
                  path: "assignTask",
                  icon: null,
                  children: [],
                },
              ],
            },

            {
              router: "approval",
              name: "审批管理",
              path: "approval",
              icon: "radar-chart",
              children: [
                {
                  router: "myApprove",
                  name: "我的审批",
                  path: "myApprove",
                  icon: null,
                },
              ],
            },
            {
              router: "systeminfo",
              name: "系统信息",
              path: "systeminfo",
              icon: "carry-out",
              children: [
                {
                  router: "approvalnotice",
                  name: "审批单信息",
                  path: "approvalnotice",
                  icon: null,
                  children: [],
                },
                {
                  router: "operatetask",
                  name: "操作任务信息",
                  path: "operatetask",
                  icon: null,
                  children: [],
                },
              ],
            },
          ],
          }
        }
        
        //const routesConfig = result.data.data
        const routesConfig = [
          "login",
          "register",
          {
            router: "exp404",
            path: "*",
            name: "404",
          },
          {
            router: "exp403",
            path: "/403",
            name: "403",
          },
        ];
        var rootMenu = {
          path: "/",
          router: "root",
          name: "home",
          children: [],
        };
        rootMenu.children = routerData.data;
        console.log(rootMenu);
        routesConfig.push(rootMenu);
        loadRoutes(routesConfig);
        this.$router.push("/taskwork/mytask");
        this.$message.success("欢迎回来" + loginRes.data.user.name, 3);
      } else {
        this.error = loginRes.msg;
        this.$message.error(res.data.msg)
      }
    },
    register() {
      this.$router.push("/register");
    },
    getcode() {
      let phone = this.form.getFieldValue("phone");
      let codereg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (codereg.test(phone)) {
        if (this.codeVal == "获取验证码") {
          loginRegist.getcode({ phone: phone }).then((res) => {
            if (res.data.code == 1) {
              console.log(res);
              this.$message.success("手机验证码发送成功请注意查收！");
            }
          });
          this.clocktimer = setInterval(this.doLoop, 1000);
        } else {
          return false;
        }
      } else {
        this.$message.error("手机号错误！");
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
