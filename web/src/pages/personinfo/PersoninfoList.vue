<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="form">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="员工姓名"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 16, offset: 1 }"
              >
                <a-input v-model="queryParam.name" placeholder="请输入员工姓名" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="员工角色"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 16, offset: 1 }"
              >
                <!-- <a-input v-model="queryParam.role" placeholder="请输入员工角色" /> -->
                <a-select
            :value="roleSelVal"
            v-model="queryParam.role"
            placeholder="请选择用户角色"
            @change="roleChange"
          >
            <a-select-option
              v-for="(item, index) in roleOptions"
              :value="item.name"
              :key="index"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <span style="float: right; margin-top: 3px">
          <a-button @click="list" icon="search" type="primary">查询</a-button>
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
        <a-button @click="showConfirm" style="margin-left: 8px" icon="delete"
          >批量删除</a-button>
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
            <a-icon type="edit" />修改角色
          </a>
          <a-popconfirm
    title="确定是否删除?"
    ok-text="Yes"
    cancel-text="No"
    @confirm="deleteconfirm(record._id)"
  >
    <a> <a-icon type="delete" />删除 </a>
  </a-popconfirm>
          <!-- <a @click="remove(record._id)"> <a-icon type="delete" />删除 </a> -->
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle" />
        </template>
      </standard-table>
    </div>
      <PersoninfoEdit
        ref="editForm"
        :title="editTitle"
        :visible="visible"
        :fields="fields"
        :rules="rules"
        :roleOptions="roleOptions"
        @cancel="editCancel"
        @create="edit"
      />
    
  </a-card>
</template>

<script>
import StandardTable from "@/components/table/StandardTable";
import PersoninfoEdit from "./PersoninfoEdit"
import {personinfo,role} from "@/services/index";

const columns = [
  {
    title: "员工姓名",
    dataIndex: "name",
  },
  {
    title: "用户角色",
    dataIndex: "role",
  },
  {
    title: "手机号",
    dataIndex: "phone",
  },
  {
    title: "邮箱",
    dataIndex: "email",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "PersoninfoList",
  components: {StandardTable,PersoninfoEdit },

  data() {
    return {
      editTitle:'',
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
        _id: '',
        name:'',
        alias:'',
        role:'',
        phone:'',
        email:'',
        operation:''
      },
      pageParams: {
        page: 1, //第几页
        size: 4, //每页中显示数据的条数
      },
      fields: {
        _id: '',
        name:'',
        alias:'',
        role:'',
        phone:'',
        email:'',
        editDepart:'',
        operation:''
      },

      rules: {
        departName: [
          { required: true, message: "请输入员工名称", trigger: "blur" }
        ],
        director: [
          { required: true, message: "请输入部门负责人", trigger: "blur" }
        ],
        departDuty: [
          { required: true, message: "请输入部门职责", trigger: "blur" }
        ]
      },
      visible: false,
      roleOptions:[],
      roleSelVal:undefined
    };
  },
  computed: {
  },
  created() {
    this.list();
    this.roleList()
  },
  methods: {
    roleChange(value){
      this.roleSelVal = value
    },

    reset() {
      this.queryParam = {
       _id: '',
        name:'',
        alias:'',
        role:'',
        phone:'',
        email:'',
        operation:''
      },
      this.fields= {
        _id: '',
        name:'',
        alias:'',
        role:'',
        phone:'',
        email:'',
        editDepart:'',
        operation:''
      }
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
    roleList() {
      role.list({action:'allData'}).then((res) => {
        if (res.data.code === 1) {
          this.roleOptions = res.data.data;
        }
      });
    },
    list() {
      this.loading = true;
      personinfo.list(this.queryParam,this.pageParams).then((res) => {
        if (res.data.code === 1) {
          console.log(res)
          const pagination = { ...this.pagination };
          pagination.total = res.data.total;
          this.dataSource = res.data.data;
          this.pagination = pagination;
        }
        this.loading = false;
      });
    },
    editUI: function (id) {
      this.loading = true;
      this.editTitle = '员工编辑'
      personinfo.getByid({ id: id }).then((res) => {
        if (res.data.code === 1) {
          this.fields = res.data.data;
          this.visible = true;
        } else {
          this.$message.error("获取失败 " + res.data.msg);
        }
      });
      this.loading = false;
    },
    editCancel() {
      this.visible = false;
    },
     edit(validfn,operationVal) {
      validfn.validate((valid) => {
        if (valid) {
          this.fields.operation = operationVal
          console.log(this.fields)
          personinfo.edit(this.fields).then((res) => {
            if (res.data.code == 1) {
              this.$message.success("操作成功");
            } else {
              this.$message.error("操作失败");
            }
            this.visible = false;
            this.reset();
            this.list();
          });
        } else {
           this.$message.error("请正确填写信息")
        }
      });
    },
    showConfirm() {
      this.$confirm({
        title: '您确定要删除这些用户信息吗？',
        content: '这会导致被删除用户无法登陆!!!',
        onOk:()=> {
          this.batchRemove();
        },
        onCancel:()=> {
          this.$message.success('取消批量删除')
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
      personinfo.batchRemove({ids:ids}).then((res) => {
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
    deleteconfirm(id){
      this.remove(id)
    },
    remove(id) {
      this.loading = true;
      personinfo.remove({ id: id }).then((res) => {
        this.loading = false;
        if (res.data.code === 1) {
          this.$message.success(res.data.msg);
          this.list()
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
