<template>
  <div>
    <a-modal
      :visible="visible"
      :title="title"
      :okText="okText"
      @cancel="
        () => {
          $emit('cancel');
        }
      "
      @ok="
        () => {
          $emit('create', formParams, dataSource);
        }
      "
    >
      <a-form-model class="form-model-attr">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
        >
          <template
            v-for="(col, i) in ['name', 'type']"
            :slot="col"
            slot-scope="text, record"
          >
            <a-form-model-item class="form-item" :key="col" :prop="col">
              <a-input
                :key="col"
                v-if="record.editable"
                :value="text"
                :placeholder="columns[i].title"
                @change="(e) => handleChange(e.target.value, record.key, col)"
              />
              <!-- <a-select
              v-show="col=='operation'"
                :value="limitSelVal"
                v-model="fields.operation"
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
              </a-select> -->
              <template v-else>{{ text }}</template>
            </a-form-model-item>
          </template>
          <template slot="action" slot-scope="text, record">
            <template v-if="record.editable">
              <span v-if="record.isNew">
                <a @click="remove(record.key)">删除</a>
              </span>
            </template>
          </template>
        </a-table>
        <a-button
          class="newAttr"
          style="width: 100%; margin-top: 16px; margin-bottom: 8px"
          type="dashed"
          icon="plus"
          @click="newAttr"
          >新增属性</a-button
        >
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
const columns = [
  {
    title: "角色名称",
    dataIndex: "name",
    key: "name",
    scopedSlots: { customRender: "name" },
    // width:'25%'
  },
  {
    title: "角色标识",
    dataIndex: "type",
    key: "type",
    scopedSlots: { customRender: "type" },
    // width:'25%'
  },
  {
    title: "操作",
    key: "action",
    scopedSlots: { customRender: "action" },
    width:'20%'
  },
];

// import { kgattr } from "@/services/index";
export default {
  name: "KgcatEdit",
  components: {},
  props: {
    visible: Boolean,
    title: {
      type: String,
      default: "批量新增",
    },
    okText: {
      type: String,
      default: "确定",
    },
    catid: String,
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: "batchAttrEdit" }),
      columns,
      dataSource: [
        {
          key: 1,
          name: "",
          type: "",
          editable: true,
          isNew: true,
        },
      ],
      formParams: [
        {
          name: "",
          type: "",
          departId:this.$route.query.departId
        },
      ],
    };
  },
  created() {},
  methods: {
    // 表单内容
    reset() {
      this.dataSource = [
        {
          key: 1,
          name: "",
          type: "",
          editable: true,
          isNew: true,
        },
      ]
      this.formParams = [
        {
          name: "",
          type: "",
          departId:this.$route.query.departId
        },
      ]
      
    },
    newAttr() {
      this.dataSource.push({
        key: this.dataSource[this.dataSource.length - 1].key + 1,
          name: "",
          type: "",
          editable: true,
          isNew: true,
      });
      this.formParams.push({
        name: "",
          type: "",
          departId:this.$route.query.departId
      });
    },

    // 删除行
    remove(key) {
      if (this.dataSource.length > 1) {
        const newData = this.dataSource.filter((item) => item.key !== key);
        this.dataSource = newData;
        this.formParams.pop()
      } else {
        this.$message.error("当前仅有一项，不能删除！");
      }
    },

    handleChange(value, key, column) {
      const newData = [...this.dataSource];
      const target = newData.filter((item) => key === item.key)[0];
      if (target) {
        target[column] = value;
        this.dataSource = newData;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.form-item {
  margin: 0;
}
.newAttr {
  width: 100%;
  margin-top: 16px;
  margin-bottom: 8px;
}
</style>
