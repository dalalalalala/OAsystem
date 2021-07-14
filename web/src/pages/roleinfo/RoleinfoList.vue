<template>
  <a-card>
    <h2 style="margin-bottom:24px">{{this.$route.query.departName}}</h2>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal" :form="form">
        <div :class="advanced ? null : 'fold'">
          <a-row>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="角色名称"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 16, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.name"
                  placeholder="请输入角色名称"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="角色标识"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 16, offset: 1 }"
              >
                <a-input
                  v-model="queryParam.type"
                  placeholder="请输入角色标识"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item
                label="角色权限"
                :labelCol="{ span: 5 }"
                :wrapperCol="{ span: 16, offset: 1 }"
              >
                <!-- <a-input
                  v-model="queryParam.operation"
                  placeholder="请输入角色权限"
                /> -->
                <a-select
            :value="limitSelVal"
            v-model="queryParam.operation"
            placeholder="请选择角色权限"
            @change="limitChange"
          >
            <a-select-option
              v-for="(item, index) in limitOptions"
              :value="item.limitName"
              :key="index"
            >
              {{ item.limitName }}
            </a-select-option>
          </a-select>
              </a-form-item>
            </a-col>
            <span style="float: right; margin-top: 3px">
                <a-button @click="list" icon="search" type="primary"
                  >查询</a-button
                >
                <a-button @click="reset" icon="reload" style="margin-left: 8px"
                  >重置</a-button
                >
              </span>
          </a-row>
        </div>
      </a-form>
    </div>
    <div>
      <div class="operator">
        <a-button @click="addUI" icon="plus" type="primary">新建</a-button>
        <a-button @click="roleAddUI" style="margin-left: 8px" icon="plus"
          >批量新增</a-button
        >
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
    <RoleAdd
      ref="roleAdd"
      :visible="visibleRoleAdd"
      :limitOptions="limitOptions"
      @cancel="cancelModal"
      @create="batchEditRole"
    />

    <RoleinfoEdit
      ref="editForm"
      :title="editTitle"
      :visible="visible"
      :fields="fields"
      :rules="rules"
      :limitOptions="limitOptions"
      @cancel="cancelModal"
      @create="edit"
    />
  </a-card>
</template>

<script>
import { mapState } from "vuex";
import StandardTable from "@/components/table/StandardTable";
import RoleinfoEdit from "./RoleinfoEdit";
import RoleAdd from "./RoleAdd";
import { role,limit } from "@/services/index";

const columns = [
  {
    title: "角色名称",
    dataIndex: "name",
  },
  {
    title: "角色标识",
    dataIndex: "type",
  },
  {
    title: "角色权限",
    dataIndex: "operation",
  },
  {
    title: "角色描述",
    dataIndex: "roleDesc",
  },
  {
    title: "操作",
    scopedSlots: { customRender: "action" },
  },
];

export default {
  name: "RoleinfoList",
  components: { StandardTable, RoleinfoEdit, RoleAdd },

  data() {
    return {
      visibleRoleAdd: false,
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
        type: "",
        name: "",
        departId: this.$route.query.departId,
        operation: "",
        roleDesc: "",
      },
      pageParams: {
        page: 1, //第几页
        size: 4, //每页中显示数据的条数
      },
      fields: {
        _id: "",
        type: "",
        name: "",
        departId: this.$route.query.departId,
        operation: "",
        roleDesc: "",
      },

      rules: {
        type: [
          { required: true, message: "请输入角色标识", trigger: "blur" },
        ],
        name: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        operation: [
          { required: true, message: "请输入角色权限", trigger: "blur" },
        ],
      },
      visible: false,
      limitOptions: [],
      limitSelVal:undefined
    };
  },
  computed: {
    ...mapState("account", { currUser: "user" }),
  },
  created() {
    this.list();
    this.limitList()
  },
  methods: {

    limitChange(value) {
      this.limitSelVal =value
    },

    reset() {
      this.queryParam = {
        _id: "",
        type: "",
        name: "",
        departId: this.$route.query.departId,
        operation: "",
        roleDesc: "",
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
      role.list(this.queryParam, this.pageParams).then((res) => {
        if (res.data.code === 1) {
          const pagination = { ...this.pagination };
          pagination.total = res.data.total;
          this.dataSource = res.data.data;
          this.pagination = pagination;
        }
        this.loading = false;
      });
    },
    limitList() {
      limit.list({action:'limitOptions'}).then((res) => {
        if (res.data.code === 1) {
          console.log(res);
          this.limitOptions = res.data.data;
        }
      });
    },
    editUI: function (id) {
      this.loading = true;
      this.editTitle = "角色编辑";
      role.getByid({ id: id }).then((res) => {
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
      this.editTitle = "角色新增";
      this.fields = {
       _id: "",
        type: "",
        name: "",
        departId: this.$route.query.departId,
        operation: "",
        roleDesc: "",
      };
      this.visible = true;
    },
    cancelModal() {
      this.visible = false;
      this.visibleRoleAdd = false;
    },
    edit(validfn) {
      validfn.validate((valid) => {
        if (valid) {
          role.edit(this.fields).then((res) => {
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
      role.batchRemove({ ids: ids }).then((res) => {
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
      role.remove({ id: id }).then((res) => {
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

    roleAddUI() {
      this.visibleRoleAdd = true;
    },
    // 批量添加角色
    batchEditRole(formParams, dataSource) {
      var errform;
      for (let item in dataSource) {
        if (dataSource[item].name != ""&&dataSource[item].type != "") {
          errform = true;
        }
        formParams[item].type = dataSource[item].type;
        formParams[item].name = dataSource[item].name;
      }
              console.log(formParams)

      if (!errform) {
        this.$message.warn("请完整输入信息");
      } else {
        console.log(formParams)
        role.batchAdd({dataParams:formParams}).then((res) => {
          if (res.data.code === 1) {
            this.$message.success(res.data.msg);
            this.list();
            this.$refs.roleAdd.reset()
            this.visibleRoleAdd = false;
          } else {
            this.$message.error('保存失败');
          }
        });
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
