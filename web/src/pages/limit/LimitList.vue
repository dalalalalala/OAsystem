<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="form">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="权限名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 18, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.limitName"
                  placeholder="请输入权限名称"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
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
      <div slot="limitMenu" slot-scope="{record}">
          <a-tag style="margin-bottom:4px" v-for="(item,index) in record.limitMenu" color="blue" :key="index">
            {{item}}
          </a-tag>
        </div>
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

    <LimitEdit
      ref="editForm"
      :title="editTitle"
      :visible="visible"
      :fields="fields"
      :rules="rules"
      :routerMenu="routerMenu"
      @cancel="cancelModal"
      @create="edit"
    />
  </a-card>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import LimitEdit from "./LimitEdit";
import { limit } from "@/services/index";

const columns = [
  {
    title: "权限名称",
    dataIndex: "limitName",
  },
  {
    title: "禁用模块",
    dataIndex: "limitMenu",
    width:'30%',
    scopedSlots: { customRender: "limitMenu" }
  },
  {
    title: "权限描述",
    dataIndex: "limitDesc",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "LimitList",
  components: { StandardTable, LimitEdit },

  data() {
    return {
      routerMenu: [
        {
          router: "institution",
          name: "组织机构",
        },
        {
          router: "personinfo",
          name: "人员信息",
        },
        {
          router: "roleinfo",
          name: "角色信息",
        },
        {
          router: "limit",
          name: "权限管理",
        },
      ],
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
        limitName: "",
        limitMenu: [],
        limitDesc: "",
      },
      pageParams: {
        page: 1, //第几页
        size: 4, //每页中显示数据的条数
      },
      loginName: "",
      fields: {
        _id: "",
        limitName: "",
        limitMenu: [],
        limitDesc: "",
      },

      rules: {
        limitName: [
          { required: true, message: "请输入权限名称", trigger: "blur" },
        ],
        limitDesc: [
          { required: true, message: "请输入权限描述", trigger: "blur" },
        ],
      },
      visible: false,
      typename: [],
    };
  },
  computed: {
    ...mapState("account", { currUser: "user" }),
  },
  created() {
    this.list();
    this.loginName = this.currUser.name;
    console.log(this.currUser.name);
  },
  methods: {
    reset() {
      this.queryParam = {
        _id: "",
        limitName: "",
        limitMenu: [],
        limitDesc: "",
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
      limit.list(this.queryParam, this.pageParams).then((res) => {
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
    editUI: function (id) {
      this.loading = true;
      this.editTitle = "权限编辑";
      limit.getByid({ id: id }).then((res) => {
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
      this.editTitle = "权限新增";
      this.fields = {
        _id: "",
        limitName: "",
        limitMenu: [],
        limitDesc: "",
      };
      this.visible = true;
    },
    cancelModal() {
      this.visible = false;
      this.visibleRoleAdd = false;
    },
    edit(validfn) {
      console.log(this.fields)
      validfn.validate((valid) => {
        if (valid) {
          limit.edit(this.fields).then((res) => {
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
      limit.batchRemove({ ids: ids }).then((res) => {
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
      limit.remove({ id: id }).then((res) => {
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
