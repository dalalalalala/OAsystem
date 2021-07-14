<template>
  <a-card>
    <div :style="currUser.operation!='一级权限'?'':{marginBottom:'46px'}" :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="form">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="项目名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.itemName"
                  placeholder="请输入项目名称"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="创建人"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.createName"
                  placeholder="请输入创建人"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="项目类型"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.type"
                  placeholder="请输入项目类型"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <span style="float: right; margin-top: 3px;">
            <a-button @click="list" icon="search" type="primary">查询</a-button>
            <a-button @click="reset" icon="reload" style="margin-left: 8px"
              >重置</a-button
            >
          </span>
        </div>
      </a-form>
    </div>
    <div>
      <div v-show="currUser.operation!='一级权限'" class="operator">
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
          <a
            @click="details(record._id, record.itemName)"
            style="margin-right: 8px"
          >
            <a-icon type="eye" />查看详情
          </a>
           <a
           v-show="record.filePath!=undefined&&record.filePath!=''"
            @click="tofile(record.filePath)"
            style="margin-right: 8px"
          >
            <a-icon type="eye" />预览附件
          </a>
          <a v-show="currUser.operation!='一级权限'" @click="editUI(record._id)" style="margin-right: 8px">
            <a-icon type="edit" />编辑
          </a>
          <a v-show="currUser.operation!='一级权限'" @click="remove(record._id)"> <a-icon type="delete" />删除 </a>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle" />
        </template>
      </standard-table>
    </div>
    <ProjectinfoEdit
      ref="editForm"
      :title="editTitle"
      :visible="visible"
      :fields="fields"
      :rules="rules"
      :personinfoOptions="personinfoOptions"
      :userNameDefaultVal="userNameDefaultVal"
      :projectFile="projectFile"
      @userNameSel="userNameSel"
      @cancel="editCancel"
      @create="edit"
      v-on:file-change="fileChange"
    />
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import ProjectinfoEdit from "./ProjectinfoEdit";
import { projectinfo ,personinfo,operation} from "@/services/index";
import { dateFormat } from "@/utils/dataFormat";
import { mapState } from "vuex";
import moment from 'moment'
const columns = [
  {
    title: "项目名称",
    dataIndex: "itemName",
  },
  {
    title: "创建人",
    dataIndex: "createName",
  },
  {
    title: "项目类型",
    dataIndex: "type",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    customRender: (text) =>moment(text).format('YYYY-MM-DD')

  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    customRender: (text) =>moment(text).format('YYYY-MM-DD')

  },
  {
    title: "附件",
    dataIndex: "fileName",
    width:'14%',
    customRender: (text) =>text==undefined||text==''?'暂无':text

  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
    width:'22%'
  },
];

export default {
  name: "projectinfoList",
  components: { StandardTable, ProjectinfoEdit },

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
        itemName: "",
        createName: "",
        userName: [],
        type: "",
        duty: "",
        createTime: "",
        endTime: "",
        itemPer: 0,
        isBegin: 0,
        isOverdue: 0,
        filePath:'',
        fileName:''
      },
      pageParams: {
        page: 1, //第几页
        size: 4, //每页中显示数据的条数
      },
      loginName: "",
      fields: {
        _id: "",
        itemName: "",
        createName: this.loginName,
        userName: [],
        type: "",
        duty: "",
        createTime: "",
        endTime: "",
        itemPer: 0,
        isBegin: 0,
        isOverdue: 0,
        filePath:'',
        fileName:''
      },

      rules: {
        itemName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
        ],
      },
      visible: false,
      personinfoOptions: [],
      userNameDefaultVal:[],
      projectFile:null,

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
  authorize: {
    deleteRecord: { check: "delete" },
  },
  computed: {
        ...mapState("account", { currUser: "user" })
  },
  created() {
    this.list();
    this.personinfoList()
  },
  methods: {
    fileChange(info) {
      this.projectFile = info.fileList
      console.log('文件改变',info.fileList)
      if (info.file.status === "done") {
        this.fields.filePath = info.file.response.data
        this.fields.fileName = info.file.name
        this.$message.success(`${info.file.name} 文件上传成功`);
      }else if(info.fileList.length==0){
        this.fields.filePath = ''
        this.fields.fileName = ''
      }else if (info.file.status === "error") {
        this.$message.error(`${info.file.name} 文件上传失败`);
      }
    },
    // 下载附件
    tofile(filePath){
      window.open(filePath)
    },
    reset() {
      this.queryParam = {
        _id: "",
        itemName: "",
        createName: "",
        userName: [],
        type: "",
        duty: "",
        createTime: "",
        endTime: "",
        itemPer: 0,
        isBegin: 0,
        isOverdue: 0,
        filePath:'',
        fileName:''
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
    details(id) {
      this.$router.push({
        path: "/projectwork/projectcom",
        query: { itemId: id}
      });
    },

    userNameSel(userNameselVal){
      this.fields.userName = userNameselVal
      console.log('值更换时返回父的数据：',this.fields.userName)
    },
    list() {
      this.loading = true;
      projectinfo.list(this.queryParam, this.pageParams).then((res) => {
        if (res.data.code === 1) {
          
          let tableData = res.data.data.map((item) => {
            item.endTime = dateFormat(item.endTime);
            item.createTime = dateFormat(item.createTime);
            return item;
          });

          const pagination = { ...this.pagination };
          pagination.total = res.data.total;
          this.dataSource = tableData;
          this.pagination = pagination;
        }
        this.loading = false;
      });
    },
    personinfoList() {
      personinfo.list({action:'projectInfo'}).then((res) => {
        if (res.data.code === 1) {
          console.log(res)
          this.personinfoOptions = res.data.data
        }
      });
    },
    editUI: function (id) {
      this.loading = true;
      this.editTitle = "项目编辑";
      projectinfo.getByid({ id: id }).then((res) => {
        if (res.data.code === 1) {
          this.fields = res.data.data;
          // 传递给子组件项目成员默认数据
          for(let i in this.fields.userName){
            this.userNameDefaultVal[i] = this.fields.userName[i].name+' ('+this.fields.userName[i].role+')'
          }
          this.visible = true;
        } else {
          this.$message.error("获取失败 " + res.data.msg);
        }
      });
      this.loading = false;
    },
    addUI() {
      this.editTitle = "项目新增";
      // 项目创建时默认项目成员中有创建人
      this.userNameDefaultVal = [this.currUser.name+' (项目经理)']

      this.fields = {
        _id: "",
        itemName: "",
        createName: this.loginName,
        userName: [],
        type: "",
        duty: "",
        createTime: "",
        endTime: "",
        itemPer: 0,
        isBegin: 0,
        isOverdue: 0,
        filePath:'',
        fileName:''
      };
      this.visible = true;
    },
    editCancel() {
      this.visible = false;
    },
    addOperation(ation,content,contentId){
      this.addOperFields={
        _id:'',
        operator:this.currUser.name,
        avatar:this.currUser.avatar,
        operPlace:'在项目中',
        operAction:ation,
        operContent:content,
        operContentId:contentId,
        operTime:''
      }
      operation.edit(this.addOperFields).then(res=>{
        console.log('活动动态：',res)
      })
    },
    edit(validfn) {
      console.log('当前field：',this.fields)
      validfn.validate((valid) => {
        if (valid) {
          projectinfo.edit(this.fields).then((res) => {
            if (res.data.code == 1) {
              this.$message.success("操作成功");
              // 创建活动动态
              if(this.fields._id!=''){
                this.addOperation('更新了',this.fields.itemName,res.data.data._id)
              }else{
                this.addOperation('创建了',this.fields.itemName,res.data.data._id)
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
      for (var r in this.selectedRows) {
        ids.push(this.selectedRows[r]._id);
      }
      if (ids.length <= 0) {
        this.$message.warn("请先勾选要删除的项");
        return;
      }
      projectinfo.batchRemove({ ids: ids }).then((res) => {
        this.loading = false;
        if (res.data.code === 1) {
          this.$message.success("删除成功");
          this.list();
        } else {
          this.$message.error("删除失败 ");
        }
      });
      this.loading = false;
    },
    remove(id) {
      this.loading = true;
      projectinfo.remove({ id: id }).then((res) => {
        this.loading = false;
        if (res.data.code === 1) {
          this.$message.success(res.data.msg);
          this.list();
        } else {
          this.$message.error(res.data.msg);
        }
      });
      this.loading = false;
    },

    handleMenuClick(e) {
      if (e.key === "delete") {
        this.remove();
      }
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
