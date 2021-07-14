<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="form">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="任务名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.departName"
                  placeholder="请输入任务名称"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="任务成员"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.director"
                  placeholder="请输入任务成员"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span style="float: right; margin-top: 3px">
                <a-button @click="list" icon="search" type="primary"
                  >查询</a-button
                >
                <a-button @click="reset" icon="reload" style="margin-left: 8px"
                  >重置</a-button
                >
              </span>
            </a-col>
          </a-row>
        </div>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button @click="addUI" icon="plus" type="primary">新建</a-button>
        <a-button @click="batchRemove" style="margin-left: 8px" icon="delete"
          >批量删除</a-button
        >
      </div>
      <standard-table
        :columns="columns"
        :dataSource="dataSource"
        :selectedRows.sync="selectedRows"
        :rowKey="rowKey"
        :pagination="pagination"
        @clear="onClear"
        @change="onChange"
      >
        <div slot="description" slot-scope="{ text }">
          {{ text }}
        </div>
        <div slot="action" slot-scope="{ text, record }">
          <a @click="editUI(record._id)" style="margin-right: 8px">
            <a-icon type="edit" />编辑
          </a>
          <a @click="remove(record._id)"> <a-icon type="delete" />删除 </a>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle" />
        </template>
      </standard-table>
    </div>
    <AssignTaskEdit
      :title="editTitle"
      :visible="visible"
      :fields="fields"
      :itemStepsOptions="itemStepsOptions"
      @cancel="cancelModal"
      @create="edit"
    />
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import AssignTaskEdit from "./AssignTaskEdit";
import { task,operation } from "@/services/index";
import { mapState } from "vuex";
import moment from "moment";

const columns = [
  {
    title: "任务名称",
    dataIndex: "taskName",
  },
  {
    title: "任务成员",
    dataIndex: "member",
  },
  {
    title: "项目步骤点",
    dataIndex: "itemStepId",
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    customRender: (text) => moment(text).format("YYYY-MM-DD"),
  },
  {
    title: "是否开始",
    dataIndex: "isBegin",
    customRender: (text) => (text == 1 ? "开始" : "未开始"),
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "AssignTaskList",
  components: { StandardTable, AssignTaskEdit },

  data() {
    return {
      moment,
      editTitle: "",
      advanced: true,
      columns: columns,
      loading: true,
      dataSource: [],
      selectedRows: [],
      rowKey: "_id",
      pagination: {
        total: 0,
        pageSize: 4, //每页中显示10条数据
        showSizeChanger: true,
        pageSizeOptions: ["4", "10", "20", "30"], //每页中显示的数据
        showTotal: (total) => `共有 ${total} 条数据`, //分页中显示总的数据
      },
      form: this.$form.createForm(this, { name: "searchForm" }),
      queryParam: {
        _id: "",
        taskName: "",
        itemId: this.$route.query.itemId,
        itemStepId: "",
        member: "",
        endTime: "",
        taskPer: 0,
        isBegin: 0,
        isOverdue: 0,
        isFinish: 0,
        content: "",
      },
      pageParams: {
        page: 1, //第几页
        size: 4, //每页中显示数据的条数
      },
      loginName: "",
      fields: {
        _id: "",
        taskName: "",
        itemId: this.$route.query.itemId,
        itemStepId: "",
        member: "",
        endTime: "",
        taskPer: 0,
        isBegin: 0,
        isOverdue: 0,
        isFinish: 0,
        beginSwitch: false,
        content: "",
      },
      visible: false,
      itemStepsOptions: [],
      // memberOptions:[]

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
  },
  created() {
    this.list();
    console.log("params参数：", this.$route.params.itemSteps);
  },
  mounted() {
    let itemSteps = this.$route.params.itemSteps;
    for (let i in itemSteps) {
      this.itemStepsOptions[i] = {
        id: itemSteps[i]._id,
        title: itemSteps[i].title,
      };
    }
    // this.memberList()
  },
  methods: {
    reset() {
      this.queryParam = {
        _id: "",
        taskName: "",
        itemId: this.$route.query.itemId,
        itemStepId: "",
        member: "",
        endTime: "",
        taskPer: 0,
        isBegin: 0,
        isOverdue: 0,
        isFinish: 0,
        beginSwitch: false,
        content: "",
      };
    },

    toggleAdvanced() {
      this.advanced = !this.advanced;
    },

    onClear() {
      this.$message.info("您清空了勾选的所有行");
    },
    onStatusTitleClick() {
      this.$message.info("你点击了状态栏表头");
    },
    onChange(pagination) {
      this.pagination.current = pagination.current;
      this.pagination.pageSize = pagination.pageSize;
      this.pageParams.page = pagination.current;
      this.pageParams.size = pagination.pageSize;
      this.list();
    },
    list() {
      this.loading = true;
      task.list(this.queryParam, this.pageParams).then((res) => {
        if (res.data.code === 1) {
          console.log(res);
          const pagination = { ...this.pagination };
          pagination.total = res.data.total;
          this.dataSource = res.data.data;
          this.pagination = pagination;
        }
        this.loading = false;
      });
    },
    // memberList() {
    //   personinfo.list({action:'memberOptions'}).then((res) => {
    //     if (res.data.code === 1) {
    //       // this.dataSource = res.data.data;
    //       this.memberOptions = res.data.data
    //       console.log(res.data.data)
    //     }
    //   });
    // },
    editUI: function (id) {
      this.loading = true;
      this.editTitle = "任务编辑";
      task.getByid({ id: id }).then((res) => {
        if (res.data.code === 1) {
          this.fields = res.data.data;
          if (this.fields.isBegin == '进行中') {
            this.fields.beginSwitch = true;
          } else {
            this.fields.beginSwitch = false;
          }
          this.visible = true;
        } else {
          this.$message.error("获取失败 " + res.data.msg);
        }
      });
      this.loading = false;
    },
    addUI() {
      this.editTitle = "任务新增";
      this.fields = {
        _id: "",
        taskName: "",
        itemId: this.$route.query.itemId,
        itemStepId: "",
        member: "",
        endTime: "",
        taskPer: 0,
        isBegin: 0,
        isOverdue: 0,
        isFinish: 0,
        beginSwitch: false,
        content: "",
      };
      this.visible = true;
    },
    cancelModal() {
      this.visible = false;
    },
     addOperation(ation,content,contentId){
      this.addOperFields={
        _id:'',
        operator:this.currUser.name,
        avatar:this.currUser.avatar,
        operPlace:'项目任务',
        operAction:ation,
        operContent:content,
        operContentId:contentId,  //项目id
        operTime:''
      }
      operation.edit(this.addOperFields).then(res=>{
        console.log('活动动态：',res)
      })
    },
    edit(validfn) {
      if (this.fields.beginSwitch) {
        this.fields.isBegin = '进行中';
      } else {
        this.fields.isBegin = '未开始';
      }
      console.log(this.fields, validfn);
      validfn.validate((valid) => {
        if (valid) {
          task.edit(this.fields).then((res) => {
            if (res.data.code == 1) {
              this.$message.success("操作成功");
               if(this.fields._id!=''){
                  this.addOperation('更新了',res.data.data.taskName,res.data.data.itemId)
                }else{
                  this.addOperation('创建了',res.data.data.taskName,res.data.data.itemId)
                }
            } else {
              this.$message.error("操作失败");
            }
            this.visible = false;
            this.reset();
            this.list();
          });
        } else {
          this.$message.error("请正确填写信息");
        }
      });
    },
    batchRemove() {
      this.loading = true;
      var ids = [];
      var taskNames = []
      for (var r in this.selectedRows) {
        ids.push(this.selectedRows[r]._id);
        taskNames.push(this.selectedRows[r].taskName)
      }
      if (ids.length <= 0) {
        this.$message.warn("请先勾选要删除的项");
        return;
      }
      console.log('批量删除',this.selectedRows)
      task.batchRemove({ ids: ids }).then((res) => {
        this.loading = false;
        if (res.data.code === 1) {
          this.$message.success("删除成功");
          this.addOperation('批量删除了',taskNames.join("、"),this.$route.query.itemId)
          this.list();
        } else {
          this.$message.error("删除失败 ");
        }
      });
      this.loading = false;
    },
    remove(id) {
      this.loading = true;
      task.remove({ id: id }).then((res) => {
        this.loading = false;
        if (res.data.code === 1) {
          this.$message.success(res.data.msg);
          this.addOperation('删除了',res.data.data.taskName,res.data.data.itemId)
          this.list();
        } else {
          this.$message.error(res.data.msg);
        }
      });
      this.loading = false;
    },
  },
};
</script>

<style lang="less" scoped>
// .search {
//   margin-bottom: 54px;
// }
.fold {
  width: calc(100% - 216px);
  display: inline-block;
}
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
.ant-calendar-picker-input {
  width: 90%;
}
</style>
