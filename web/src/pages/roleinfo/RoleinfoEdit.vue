<template>
  <div>
    <a-modal
      :visible="visible"
      :title="title"
      :okText="okText"
      :fields="fields"
      @cancel="() => {
                $emit('cancel');
              }"
      footer=""
    >
      <a-form-model
        ref="ruleForm"
        :model="fields"
        :form="form"
        :rules="rules"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item v-show="title!='角色新增'" label="唯一标识" prop="_id">
          <a-input v-model="fields._id" disabled />
        </a-form-model-item>
        <a-form-model-item label="部门名称">
          <a-input :value="this.$route.query.departName" disabled />
        </a-form-model-item>
        <a-form-model-item label="角色名称" prop="name">
          <a-input v-model="fields.name" />
        </a-form-model-item>
        <a-form-model-item label="角色标识" prop="type">
          <a-input v-model="fields.type" />
        </a-form-model-item>
        <a-form-model-item label="角色权限" prop="operation">
          <!-- <a-input v-model="fields.operation" /> -->
          <a-select
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
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="角色描述" prop="roleDesc">
          <a-input v-model="fields.roleDesc" />
        </a-form-model-item>
        <a-form-model-item
          class="form-btn"
          :wrapper-col="{ span: 8, offset: 16 }"
        >
          <a-button
            style="margin-right: 10px"
            @click="
              () => {
                $emit('cancel');
              }
            "
          >
            取消
          </a-button>
          <a-button
            type="primary"
            @click="
              () => {
                $emit('create', this.$refs.ruleForm);
              }
            "
          >
            确定
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
  </div>
</template>

<script>
export default {
  name: "InstitutionEdit",
  components: {},
  props: {
    visible: Boolean,
    iseditIdname: Boolean,
    title: {
      type: String,
      default: "角色新增",
    },
    okText: {
      type: String,
      default: "确定",
    },
    fields: Object,
    rules: Object,
    limitOptions:Array
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: "editForm" }),
      limitSelVal:undefined,
    };
  },
  created() {},
  methods: {
    limitChange(value) {
      this.limitSelVal =value
      console.log(`selected ${value}`);
    },
  },
};
</script>

<style lang="less" scoped>
.color-input {
  min-width: 50px;
  max-width: 100px;
  margin-right: 10px;
}
.form-btn {
  border-top: 1px solid #eee;
  padding-top: 10px;
  margin-bottom: 0px;
}
</style>
