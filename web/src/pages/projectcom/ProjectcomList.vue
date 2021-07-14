<template>
  <page-layout>
    <div slot="headerContent">
      <span class="header-title">{{ projectData.itemName }}</span>
      <a-tag
        :color="
          projectData.isBegin == '未开始'
            ? 'blue'
            : projectData.isBegin == '进行中'
            ? 'cyan'
            : projectData.isBegin == '已完成'
            ? 'green'
            : projectData.isBegin == '逾期完成'
            ? 'orange'
            : projectData.isBegin == '逾期未完成'
            ? 'red'
            : ''
        "
        >{{ projectData.isBegin }}</a-tag
      >
    </div>
    <template slot="extra">
      <span style="margin-right: 10px">倒计时</span>
      <a-statistic-countdown
        :value="projectData.endTime"
        format="D 天 H 时 m 分 s 秒"
      />
    </template>
    <template>
      <a-row style="margin: 0 -12px">
        <a-col
          style="padding: 0 12px"
          :xl="16"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px"
            :bordered="false"
            :title="$t('项目步骤')"
          >
            <a v-show="currUser.operation!='一级权限'" slot="extra" style="margin-right: 10px" @click="addStepUI"
              >新增步骤</a
            >
            <a v-show="currUser.operation!='一级权限'" slot="extra" @click="assignTask">派发任务</a>

            <div v-show="itemSteps.length != 0">
              <a-steps
                class="item-steps"
                v-model="selStep.current"
                type="navigation"
                size="small"
                :style="stepStyle"
              >
                <a-step
                  class="item-step"
                  v-for="(item, index) in itemSteps"
                  :key="index"
                  :title="item.title"
                  :sub-title="item.endTime"
                  :status="item.status"
                  :description="item.description"
                  @click="selectstep(index, item._id)"
                />
              </a-steps>
              <div style="display: flex; justify-content: flex-end">
                <a
                  v-show="currUser.operation!='一级权限'"
                  @click="editStepUI(selStep.current)"
                  style="margin-right: 10px"
                  >编辑</a
                >
                <a v-show="currUser.operation!='一级权限'" @click="removeStep(selStep.current)">删除</a>
              </div>
              <div class="steps-content" v-if="itemSteps.length != 0">
                {{ itemSteps[selStep.current].content }}
              </div>
            </div>
            <a-empty
              description="暂无项目步骤"
              v-show="itemSteps.length == 0"
            />
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
            :title="projectData.itemName + '  完成度'"
            style="margin-bottom: 24px"
            :bordered="false"
            :body-style="{ padding: 0 }"
          >
            <div
              style="
                min-height: 200px;
                display: flex;
                justify-content: center;
                align-items: center;
              "
            >
              <div>
                <a-progress type="circle" :percent="projectData.itemPer" />
                <a-button-group v-if="projectData.createName==currUser.name" style="margin-left: 20px">
                  <a-button icon="minus" @click="decline" />
                  <a-button icon="plus" @click="increase" />
                </a-button-group>
              </div>
            </div>
          </a-card>
          <a-card :loading="loading" :title="$t('项目成员')" :bordered="false">
            <div class="members">
              <a-row>
                <a-col :span="12" v-for="(item, index) in teams" :key="index">
                  <a>
                    <a-avatar size="small" :src="item.avatar" />
                    <a-tooltip placement="topLeft">
                      <template slot="title">
                        <span>{{ item.role }}</span>
                      </template>
                      <span class="member">{{ item.name }}</span>
                    </a-tooltip>
                  </a>
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>
      </a-row>
    </template>
    <ItemStepEdit
      ref="editForm"
      :title="editItemStepTitle"
      :visible="itemStepvisible"
      :fields="itemStepFields"
      @cancel="cancelModal"
      @create="editItemStep"
    />
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
import { mapState } from "vuex";
import { request, METHOD } from "@/utils/request";
import ItemStepEdit from "./ItemStepEdit";
import { projectinfo, itemStep,operation } from "@/services/index";
import moment from "moment";
export default {
  name: "WorkPlace",
  components: { PageLayout, ItemStepEdit },
  data() {
    return {
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
        isBegin: "未开始",
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
        isBegin: "未开始",
        isOverdue: 0,
      },
      //活动动态
      addOperFields:{
        _id:'',
        operator:'',
        avatar:'',
        operPlace:'',
        operAction:'',
        operContent:'',
        operContentId:'',  //该内容的项目id
        operTime:''
      } 
    };
  },
  computed: {
    ...mapState("account", { currUser: "user" }),
    ...mapState("setting", ["lang"]),
  },
  created() {
    this.projectGetByid();
    this.stepList();
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
  methods: {
    // 项目完成度进度条控制
    increase() {
      let percent = this.projectData.itemPer + 10;
      if (percent > 100) {
        percent = 100;
      }
      this.projectData.itemPer = percent;
      this.editItemPer(percent);
    },
    decline() {
      let percent = this.projectData.itemPer - 10;
      if (percent < 0) {
        percent = 0;
      }
      this.projectData.itemPer = percent;
      this.editItemPer(percent);
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
    editItemPer(percent) {
      let nowDate = this.getNowDate();
      console.log("当前时间：", nowDate);
      let endTime = moment(this.projectData.endTime).format("YYYY-MM-DD");

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
      projectinfo
        .edit({
          _id: this.$route.query.itemId,
          itemPer: percent,
          isBegin: isBegin,
        })
        .then((res) => {
          if (res.data.code == 1) {
            this.projectGetByid();
            this.$message.success("操作成功");
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
    cancelModal() {
      this.itemStepvisible = false;
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
        params: { itemSteps: this.itemSteps, teams: this.teams },
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
     addOperation(ation,content,contentId){
      this.addOperFields={
        _id:'',
        operator:this.currUser.name,
        avatar:this.currUser.avatar,
        operPlace:'项目步骤',
        operAction:ation,
        operContent:content,
        operContentId:contentId,  //项目id
        operTime:''
      }
      operation.edit(this.addOperFields).then(res=>{
        console.log('活动动态：',res)
      })
    },
    editItemStep(validfn) {
      let filedsEndtime = moment(this.itemStepFields.endTime).format(
        "YYYY-MM-DD"
      );
      let proCreatetime = moment(this.projectData.createTime).format(
        "YYYY-MM-DD"
      );
      let proEndtime = moment(this.projectData.endTime).format("YYYY-MM-DD");

      validfn.validate((valid) => {
        if (valid) {
          if (filedsEndtime <= proEndtime && filedsEndtime >= proCreatetime) {
            itemStep.edit(this.itemStepFields).then((res) => {
              if (res.data.code == 1) {
                this.$message.success("操作成功");
                
                // 新增活动动态
                if(this.itemStepFields._id!=''){
                  this.addOperation('更新了',this.itemStepFields.title,res.data.data.itemID)
                }else{
                  this.addOperation('创建了',this.itemStepFields.title,res.data.data.itemID)
                }
              } else {
                this.$message.error("操作失败");
              }
              this.itemStepvisible = false;
              this.reset();
              this.stepList();
            });
          } else {
            this.$message.error(
              `步骤时间应在项目期:${proCreatetime}~${proEndtime}`
            );
          }
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
          this.addOperation('删除了',res.data.data.title,res.data.data.itemID)
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
      projectinfo.getByid({ id: this.$route.query.itemId }).then((res) => {
        if (res.data.code === 1) {
          this.projectData = res.data.data;
          this.teams = res.data.data.userName;
          // if (this.projectData.isBegin == 0) {
          //   this.proStatus = { isBegin: 0, color: "cyan", text: "未开始" };
          // } else if (this.projectData.isBegin == 1) {
          //   this.proStatus = { isBegin: 1, color: "blue", text: "进行中" };
          // } else if (this.projectData.isBegin == 2) {
          //   this.proStatus = { isBegin: 2, color: "green", text: "已完成" };
          // } else if (this.projectData.isBegin == 3) {
          //   this.proStatus = { isBegin: 3, color: "red", text: "已逾期" };
          // }
          this.visible = true;
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
</style>
