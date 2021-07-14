<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="form">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="申请人"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input v-model="queryParam.applicant" placeholder="请输入申请人" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="状态"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <!-- <a-input v-model="queryParam.isapproved" placeholder="请输入状态" /> -->
                 <a-select
          :value="isapprovedVal"
          placeholder="请选择状态"
          @change="isapprovedChange"
          v-model="queryParam.isapproved"
        >
          <a-select-option
            :value="item"
            v-for="(item, index) in isapprovedOptions"
            :key="index"
            >{{ item }}</a-select-option
          >
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
        <a-button @click="batchApprove" style="margin-left: 8px"
          ><a-icon type="check" style="color:green;" />一键同意</a-button>
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
        <div slot="state" slot-scope="{record}">
          <a-tag style="margin-bottom:4px"  :color="record.isapproved=='未处理'?'blue':record.isapproved=='已逾期'?'orange':record.isapproved=='同意'?'green':record.isapproved=='不同意'?'red':'blue'">
            {{record.isapproved}}
          </a-tag>
        </div>
        <div slot="description" slot-scope="{ text }">
          {{ text }}
        </div>
        <div v-show="record.isapproved!='已逾期'" slot="action" slot-scope="{ text, record }">
          <a @click="editApprove(record,'同意')" style="margin-right: 8px;color:green;" >
            同意
          </a>
          <a @click="editApprove(record,'不同意')" style="color:red;"> 不同意 </a>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle" />
        </template>
      </standard-table>
    </div>

  </a-card>
</template>

<script>
import {mapState} from 'vuex'
import StandardTable from "@/components/table/StandardTable";
import {application} from "@/services/index";
import moment from 'moment'

const columns = [
  {
    title: "申请人",
    dataIndex: "applicant",
  },
  {
    title: "审批类型",
    dataIndex: "type",
  },
  {
    title: "内容",
    dataIndex: "remarks",
    width:'16%'
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
    title: "时长",
    dataIndex: "validity",
  },
  {
    title: "状态",
    dataIndex: "isapproved",
    scopedSlots: { customRender: "state" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "WaitApproveList",
  components: {StandardTable},

  data() {
    return {
      moment,
      isapprovedOptions:['未处理','已逾期','同意','不同意'],
      isapprovedVal:undefined,
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
        isapproved:'',
        
      },
      pageParams: {
        action:'waitApprove',
        page: 1, //第几页
        size: 4, //每页中显示数据的条数
      },
      loginName:'',
      fields: {
        _id: '',
        applicant:'',
        isapproved:'',
        
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

    isapprovedChange(val){
      this.isapprovedVal = val
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
    reset() {
      this.queryParam = {
       _id: '',
        applicant:'',
        isapproved:'',
        
      }
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
    cancelModal() {
      this.visible = false;
      this.visibleRoleAdd = false
    },
     editApprove(record,approve) {
      record.isapproved = approve
          application.editApprove(record).then((res) => {
            if (res.data.code == 1) {
              this.$message.success("操作成功");
            } else {
              this.$message.error("操作失败");
            }
            this.visible = false;
            this.list();
          });
    },
    batchApprove() {
      this.loading = true;
      var ids = [];
      for (var r in this.selectedRows) {
        ids.push(this.selectedRows[r]._id);
      }
      if (ids.length <= 0) {
        this.$message.warn("请先勾选要审批的项");
        return;
      }
      console.log(ids)
      application.batchApprove({ids:ids}).then((res) => {
        this.loading = false;
        if (res.data.code === 1) {
          this.$message.success("批量审批成功");
          this.selectedRows=[]
          this.list();
        } else {
          this.$message.error("批量审批失败 ");
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
