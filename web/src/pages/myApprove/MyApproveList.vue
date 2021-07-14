<template>
  <a-card>
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
          <a @click="goDetail(record._id)" style="margin-right: 8px">
            <a-icon type="eye" />详情
          </a>
          <a @click="editUI(record._id)" style="margin-right: 8px">
            <a-icon type="edit" />编辑
          </a>
          <a @click="remove(record._id)"> <a-icon type="delete" />撤销 </a>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle" />
        </template>
      </standard-table>
    </div>
      <MyApproveEdit
        ref="editForm"
        :title="editTitle"
        :visible="visible"
        :fields="fields"
        @dateChange="dateChange"
        @cancel="cancelModal"
        @create="edit"
      />
      <MyApproveDetail
        :visible="detailVisible"
        :fields="fields"
        @cancel="cancelModal"
      />
  </a-card>
</template>

<script>
import {mapState} from 'vuex'
import StandardTable from "@/components/table/StandardTable";
import MyApproveEdit from "./MyApproveEdit"
import MyApproveDetail from "./MyApproveDetail"
import {application} from "@/services/index";
import moment from 'moment'

const columns = [
  {
    title: "审批人",
    dataIndex: "approver",
     customRender: (text) =>text==undefined?'无':text
  },
  {
    title: "审批类型",
    dataIndex: "type",
  },
  {
    title: "开始时间",
    dataIndex: "beginValidity",
    customRender: (text) =>moment(text).format('YYYY-MM-DD')
  },
  {
    title: "结束时间",
    dataIndex: "endValidity",
    customRender: (text) =>moment(text).format('YYYY-MM-DD')
  },
  {
    title: "有效时长",
    dataIndex: "validity",
  },
  {
    title: "状态",
    dataIndex: "isapproved",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "ApplicationList",
  components: {StandardTable,MyApproveEdit,MyApproveDetail},

  data() {
    return {
      moment,
      detailVisible:false,
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
        applicant:'',
        approver:'',
        type:'',
        createTime:'',
        validity:'',
        beginValidity:'',
        endValidity:'',
        remarks:'',
        isapproved:''
      },
      pageParams: {
        page: 1, //第几页
        size: 4, //每页中显示数据的条数
      },
      fields: {
        _id: '',
        applicant:'',
        approver:'',
        type:'',
        createTime:'',
        validity:'',
        beginValidity:'',
        endValidity:'',
        remarks:'',
        isapproved:'未处理'
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
  },
  methods: {
    reset() {
      this.queryParam = {
        _id: '',
        applicant:'',
        approver:'',
        type:'',
        createTime:'',
        validity:'',
        beginValidity:'',
        endValidity:'',
        remarks:'',
        isapproved:''
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
    dateChange(date,dateString){
      this.fields.beginValidity = dateString[0]
      this.fields.endValidity = dateString[1]
      console.log(date,dateString)
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
      application.list(this.queryParam,this.pageParams).then((res) => {
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
      this.editTitle = '审批编辑'
      application.getByid({ id: id }).then((res) => {
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
      this.editTitle = '申请审批'
      this.fields = {
         _id: '',
        applicant:'',
        approver:'',
        type:'',
        createTime:'',
        validity:'',
        beginValidity:'',
        endValidity:'',
        remarks:'',
        isapproved:'未处理'
      };
      this.visible = true;
    },
    cancelModal() {
      this.visible = false;
      this.visibleRoleAdd = false
      this.detailVisible = false
    },
     edit(validfn) {
      console.log(validfn)
      console.log(this.fields.beginValidity)
      console.log(this.fields.endValidity)
      let begin=moment(this.fields.beginValidity)
      let end=moment(this.fields.endValidity)
      let day = end.diff(begin, 'day');
      this.fields.validity = day+' 天'
      validfn.validate((valid) => {
        if (valid) {
          console.log(valid)
          application.edit(this.fields).then((res) => {
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
      application.batchRemove({ids:ids}).then((res) => {
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
      application.remove({ id: id }).then((res) => {
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
    goDetail(id){
      application.getByid({ id: id }).then((res) => {
        if (res.data.code === 1) {
          this.fields = res.data.data;
          this.detailVisible = true;
        } else {
          this.$message.error("获取失败 " + res.data.msg);
        }
      });
    }
   
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
