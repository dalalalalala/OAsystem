<template>
  <page-layout>
    <div slot="headerContent">
      <span class="header-title">{{ projectData.itemName }}</span>
      <span style="margin-right:10px;">项目经理：{{projectData.createName}}</span>
      <span>任务负责人：{{this.$route.params.name}}</span>
    </div>
    <template>
      <a-row style="margin: 0 -12px">
        <a-col
          style="padding: 0 12px;"
          :xl="16"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px;min-height: 433px;background: #fff;"
            :bordered="false"
            :title="$t('任务内容')"
          >
            <a-collapse
              v-show="taskOptions.length != 0"
              accordion
              default-active-key="0"
              @change="taskActiveKey"
            >
              <a-collapse-panel
                v-for="(item, index) in taskOptions"
                :key="index"
                :header="item.itemStepId"
              >
                <a-tag
                  slot="extra"
                  :color="
                    item.isBegin == '未开始'
                      ? 'blue'
                      : item.isBegin == '进行中'
                      ? 'cyan'
                      : item.isBegin == '已完成'
                      ? 'green'
                      : item.isBegin == '逾期完成'
                      ? 'orange'
                      : item.isBegin == '逾期未完成'
                      ? 'red'
                      : ''
                  "
                  >{{ item.isBegin }}</a-tag
                >
                <p>{{ item.taskName }}</p>
                <p>结束时间：{{ moment(item.endTime).format("YYYY-MM-DD") }}</p>
                <p>{{ item.content }}</p>
              </a-collapse-panel>
            </a-collapse>
            <a-empty description="暂无任务" v-show="taskOptions.length == 0" />

            <!-- <div class="steps-content" v-if="itemSteps.length != 0">
              {{ itemSteps[selStep.current].content }}
            </div> -->
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <a-card
            :loading="loading"
            :title="nowTaskPer.taskName + '  完成度'"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div
              v-show="taskOptions.length != 0"
              style="
                min-height: 200px;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div>
                <a-progress type="circle" :percent="nowTaskPer.taskPer" />
              </div>
            </div>
            <a-empty description="暂无任务" v-show="taskOptions.length == 0" />
          </a-card>
          <a-card :loading="loading" :title="$t('队员信息')" :bordered="false">
            <div class="members">
              <a-row>
                <a-col>
                  <a>
                    <a-avatar size="small" :src="teamMemberInfo.avatar" />
                    <a-tooltip placement="topLeft">
                      <template slot="title">
                        <span>{{ teamMemberInfo.role }}</span>
                      </template>
                      <span class="member">{{ teamMemberInfo.name }}</span>
                    </a-tooltip>
                  </a>
                  <a-col :span="12"><span>职位：{{teamMemberInfo.role}}</span></a-col>
                  <a-col :span="12"><span>手机：{{teamMemberInfo.phone}}</span></a-col>
                  <a-col :span="24"><span>邮箱：{{teamMemberInfo.email}}</span></a-col>

                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </template>
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
// import HeadInfo from "@/components/tool/HeadInfo";
import { mapState } from "vuex";
import { request, METHOD } from "@/utils/request";
import { itemStep, task,projectinfo} from "@/services/index";
import moment from "moment";
export default {
  name: "TaskcomList",
  components: { PageLayout },
  data() {
    return {
      form: this.$form.createForm(this, { name: "ruleForm" }),
      moment,
      selStep: {
        current: 0,
        id: "",
      },
      stepStyle: {
        marginBottom: "60px",
        boxShadow: "0px -1px 0 0 #e8e8e8 inset",
      },

      itemSteps: [
        {
          _id: "",
          itemID: this.$route.query.itemId,
          title: "",
          endTime: "",
          status: "",
          description: "",
          content: "",
        },
      ],
      projects: [],
      loading: true,
      activities: [],
      teams: [],
      proStatus: {
        isBegin: 0,
        color: "",
        text: "",
      },
      projectData: {
        _id: "",
        itemName: "",
        createName: "",
        userName: [],
        type: "",
        duty: "",
        createTime: "",
        endTime: "",
        itemStep: [],
        itemPer: 0,
        isBegin: '未开始',
        isOverdue: 0,
      },
      welcome: {
        timeFix: "",
        message: "",
      },
      editItemStepTitle: "",
      itemStepvisible: false,
      stepQueryParam: {
        _id: "",
        itemID: this.$route.query.itemId,
        title: "",
        endTime: "",
        status: "",
        description: "",
        content: "",
      },
      itemStepFields: {
        _id: "",
        itemID: this.$route.query.itemId,
        title: "",
        endTime: "",
        status: "",
        description: "",
        content: "",
      },
      stepPageParams: {
        page: 1, //第几页
        size: 10, //每页中显示数据的条数
      },
      fields: {
        _id: "",
        itemName: "",
        createName: "",
        userName: [],
        type: "",
        duty: "",
        createTime: "",
        endTime: "",
        itemStep: [],
        itemPer: 0,
        isBegin: '未开始',
        isOverdue: 0,
      },
      taskOptions: [],
      nowTaskPer: {
        _id: "",
        itemStepId: "",
        taskName: "",
        taskPer: 0,
        endTime: "",
      },
      nowTaskPanleKey: 0,
      teamMemberInfo:this.$route.params
    };
  },
  computed: {
    ...mapState("account", { currUser: "user" }),
    ...mapState("setting", ["lang"]),
  },
  created() {
    this.projectGetByid();
    this.stepList();
    this.getByitemAndUser();
    console.log('参数：',this.$route.params)
    request("/user/welcome", METHOD.GET).then((res) => {
      this.welcome = res.data;
      console.log(res);
    });
    request("/work/activity", METHOD.GET).then(
      (res) => (this.activities = res.data)
    );
    // request("/work/team", METHOD.GET).then((res) => (this.teams = res.data));
    request("/project", METHOD.GET).then((res) => {
      this.projects = res.data;
      this.loading = false;
    });
  },
  watch: {
    nowTaskPanleKey(newVal) {
      this.nowTaskPer = {
        _id: this.taskOptions[newVal]._id,
        itemStepId: this.taskOptions[newVal].itemStepId,
        taskName: this.taskOptions[newVal].taskName,
        taskPer: this.taskOptions[newVal].taskPer,
        endTime: this.taskOptions[newVal].endTime,
      };
    },
  },

  methods: {
    // 点击任务折叠面板操作
    taskActiveKey(key) {
      this.nowTaskPanleKey = key;
      // console.log(this.taskOptions[key]);
      console.log("切换", this.nowTaskPanleKey);
    },

    // 根据用户及项目id获取我的任务信息
    getByitemAndUser() {
      task
        .getByitemAndUser({ itemId: this.$route.query.itemId,member: this.$route.params.name })
        .then((res) => {
          if (res.data.code === 1) {
            this.taskOptions = res.data.data;
            this.nowTaskPer = {
              _id: this.taskOptions[this.nowTaskPanleKey]._id,
              itemStepId: this.taskOptions[this.nowTaskPanleKey].itemStepId,
              taskName: this.taskOptions[this.nowTaskPanleKey].taskName,
              taskPer: this.taskOptions[this.nowTaskPanleKey].taskPer,
              endTime: this.taskOptions[this.nowTaskPanleKey].endTime,
            };
            console.log(this.nowTaskPer);
          } else {
            this.$message.error("获取失败 " + res.data.msg);
          }
        });
    },
    getNowDate() {
      // 获取当前时间
      var d = new Date(),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      return [year, month, day].join("-");
    },

    editTaskPer(percent) {
      console.log(percent, this.nowTaskPer._id);
      // 处理后端isBegin，从nowTaskPer的endTime入手
      let nowDate = this.getNowDate();
      console.log("当前时间：", nowDate);
      let endTime = moment(this.nowTaskPer.endTime).format("YYYY-MM-DD");

      let isBegin = "";
      if (percent == 0 && nowDate <= endTime) {
        isBegin = "未开始";
      } else if (percent > 0 && percent < 100 && nowDate <= endTime) {
        isBegin = "进行中";
      } else if (percent == 100 && nowDate <= endTime) {
        isBegin = "已完成";
      } else if (percent == 100 && nowDate > endTime) {
        isBegin = "逾期完成";
      } else if (percent < 100 && nowDate > endTime) {
        isBegin = "逾期未完成";
      }
      console.log(isBegin);
      task
        .edit({ _id: this.nowTaskPer._id, taskPer: percent, isBegin: isBegin })
        .then((res) => {
          if (res.data.code == 1) {
            this.$message.success("操作成功");
            this.getByitemAndUser();
          } else {
            this.$message.error("操作失败");
          }
        });
    },

    reset() {
      (this.stepQueryParam = {
        _id: "",
        itemID: this.$route.query.itemId,
        title: "",
        endTime: "",
        status: "",
        description: "",
        content: "",
      }),
        (this.itemStepFields = {
          _id: "",
          itemID: this.$route.query.itemId,
          title: "",
          endTime: "",
          status: "",
          description: "",
          content: "",
        });
    },
    addStepUI() {
      this.editItemStepTitle = "新增步骤";
      this.itemStepvisible = true;
    },
    editStepUI(current) {
      console.log(this.itemSteps[current]._id);
      console.log(current);
      this.editItemStepTitle = "步骤编辑";
      itemStep.getByid({ id: this.itemSteps[current]._id }).then((res) => {
        if (res.data.code === 1) {
          this.itemStepFields = res.data.data;
          this.itemStepvisible = true;
        } else {
          this.$message.error("获取失败 " + res.data.msg);
        }
      });
    },
    assignTask() {
      console.log(this.$route.query.itemId);
      this.$router.push({
        path: "/projectwork/assignTask",
        name: "派发任务",
        query: { itemId: this.$route.query.itemId },
        params: { itemSteps: this.itemSteps },
      });
    },
    stepList() {
      this.loading = true;
      itemStep.list(this.stepQueryParam, this.stepPageParams).then((res) => {
        if (res.data.code === 1) {
          console.log(res);
          // this.itemSteps = res.data.data;
          this.itemSteps = res.data.data.map((item) => {
            item.endTime = moment(item.endTime).format("YYYY-MM-DD");
            return item;
          });
        }
        this.loading = false;
      });
    },
    editItemStep(validfn) {
      validfn.validate((valid) => {
        if (valid) {
          itemStep.edit(this.itemStepFields).then((res) => {
            if (res.data.code == 1) {
              this.$message.success("操作成功");
            } else {
              this.$message.error("操作失败");
            }
            this.itemStepvisible = false;
            this.reset();
            this.stepList();
          });
        } else {
          this.$message.error("请正确填写信息");
        }
      });
    },
    removeStep(current) {
      this.selStep.id = this.itemSteps[current]._id;
      itemStep.remove({ id: this.selStep.id }).then((res) => {
        this.loading = false;
        if (res.data.code === 1) {
          this.$message.success(res.data.msg);
          let index = this.selStep.current--;
          this.selStep.id = this.itemSteps[index]._id;
          console.log(this.itemSteps[index]._id);
          this.stepList();
        } else {
          this.$message.error(res.data.msg);
        }
      });
      console.log(current);
    },
    selectstep(index, id) {
      this.selStep.current = index;
      this.selStep.id = id;
      console.log(this.selStep.id);
      console.log(this.selStep.current);
    },
    projectGetByid() {
      console.log('用户',this.currUser.name)
      projectinfo.getByid({ id: this.$route.query.itemId }).then((res) => {
        if (res.data.code === 1) {
          this.projectData = res.data.data;
          this.teams = res.data.data.userName;
        } else {
          this.$message.error("获取失败 " + res.data.msg);
        }
      });
    },
  },
};
</script>

<style lang="less">
.item-steps {
  margin-bottom: 24px !important;
  display: block !important;
}
.item-step {
  margin-right: 36px !important;
  margin-bottom: 14px !important;
}
.steps-content {
  border: 1px dashed #e9e9e9;
  border-radius: 6px;
  background-color: #fafafa;
  min-height: 200px;
  padding: 24px;
}
.header-title {
  margin-right: 30px;
  font-size: 26px;
  color: #000;
}
.project-list {
  .card-title {
    span {
      vertical-align: middle;
      &:last-child {
        margin-left: 12px;
      }
    }
  }
  .project-item {
    display: flex;
    justify-content: space-between;
    margin-top: 8px;
    overflow: hidden;
    font-size: 12px;
    color: inherit;
    .group {
      color: @text-color;
      flex: 1 1 0;
      &:hover {
        color: @primary-color;
      }
    }
    .datetime {
      color: @text-color-second;
      flex: 0 0 auto;
    }
  }
  .ant-card-meta-description {
    height: 44px;
    line-height: 22px;
    overflow: hidden;
  }
}
.item-group {
  padding: 20px 0 8px 24px;
  font-size: 0;
  a {
    color: inherit;
    display: inline-block;
    font-size: 14px;
    margin-bottom: 13px;
    width: 25%;
  }
}
.members {
  a {
    display: block;
    margin: 12px 0;
    color: @text-color;
    &:hover {
      color: @primary-color;
    }
    .member {
      vertical-align: middle;
      margin-left: 12px;
    }
  }
}

.form-btn {
  border-top: 1px solid #eee;
  padding-top: 10px;
  margin-bottom: 0px;
}
</style>
