<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="form">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="部门名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input v-model="queryParam.departName" placeholder="请输入部门名称" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="负责人"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input v-model="queryParam.director" placeholder="请输入部门负责人" />
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
        <a-button @click="addUI" icon="plus" type="primary">新建</a-button>
        <a-button @click="batchRemove" style="margin-left: 8px" icon="delete"
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
          <a @click="roleAddUI(record._id,record.departName)" style="margin-right: 8px">
            <a-icon type="eye" />角色
          </a>
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

      <InstitutionEdit
        ref="editForm"
        :title="editTitle"
        :visible="visible"
        :fields="fields"
        :rules="rules"
        @cancel="cancelModal"
        @create="edit"
      />
    
  </a-card>
</template>

<script>
import {mapState} from 'vuex'
import StandardTable from "@/components/table/StandardTable";
import InstitutionEdit from "./InstitutionEdit"
import {institution} from "@/services/index";

const columns = [
  {
    title: "部门名称",
    dataIndex: "departName",
  },
  {
    title: "部门负责人",
    dataIndex: "director",
  },
  {
    title: "部门职责",
    dataIndex: "departDuty",
     width:'20%'
  },
  {
    title: "部门描述",
    dataIndex: "departDesc",
    width:'20%'
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "InstitutionList",
  components: {StandardTable,InstitutionEdit},

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
        departName:'',
        director:'',
        departDuty:'',
        departDesc:''
      },
      pageParams: {
        page: 1, //第几页
        size: 4, //每页中显示数据的条数
      },
      loginName:'',
      fields: {
        _id: '',
        departName:'',
        director:'',
        departDuty:'',
        departDesc:''
      },

      rules: {
        departName: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
        ],
        director: [
          { required: true, message: "请输入部门负责人", trigger: "blur" }
        ],
        departDuty: [
          { required: true, message: "请输入部门职责", trigger: "blur" }
        ]
      },
      visible: false,
      typename:[]
    };
  },
  computed: {
    ...mapState('account', {currUser: 'user'})
  },
  created() {
    this.list();
    this.loginName = this.currUser.name
    console.log(this.currUser.name)
  },
  methods: {
    reset() {
      this.queryParam = {
       _id: '',
        departName:'',
        director:'',
        departDuty:'',
        departDesc:''
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
    list() {
      this.loading = true;
      institution.list(this.queryParam,this.pageParams).then((res) => {
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
      this.editTitle = '部门编辑'
      institution.getByid({ id: id }).then((res) => {
        if (res.data.code === 1) {
          this.fields = res.data.data;
          this.visible = true;
        } else {
          this.$message.error("获取失败 " + res.data.msg);
        }
      });
      this.loading = false;
    },
    addUI() {
      this.editTitle = '部门新增'
      this.fields = {
        _id: '',
        departName:'',
        director:'',
        departDuty:'',
        departDesc:''
      };
      this.visible = true;
    },
    cancelModal() {
      this.visible = false;
      this.visibleRoleAdd = false
    },
     edit(validfn) {
      console.log(validfn)
      validfn.validate((valid) => {
        if (valid) {
          institution.edit(this.fields).then((res) => {
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
      institution.batchRemove({ids:ids}).then((res) => {
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
      institution.remove({ id: id }).then((res) => {
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

    roleAddUI(departId,departName){
      console.log(departId)
      this.$router.push({path:'/teamwork/roleinfo',query:{departId:departId,departName:departName}})
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
