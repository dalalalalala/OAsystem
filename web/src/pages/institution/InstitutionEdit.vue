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
        <a-form-model-item v-show="title!='部门新增'" label="唯一标识" prop="_id">
          <a-input v-model="fields._id" disabled />
        </a-form-model-item>
        <a-form-model-item label="部门名称" prop="departName">
          <a-input v-model="fields.departName" />
        </a-form-model-item>
        <a-form-model-item label="部门负责人" prop="director">
          <a-input v-model="fields.director" />
        </a-form-model-item>
        <a-form-model-item label="部门职责" prop="departDuty">
          <a-input v-model="fields.departDuty" />
        </a-form-model-item>
        <a-form-model-item label="部门描述" prop="departDesc">
          <a-input v-model="fields.departDesc" />
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
      default: "部门新增",
    },
    okText: {
      type: String,
      default: "确定",
    },
    fields: Object,
    rules: Object,
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: "editForm" }),
      userNameselVal:undefined,
      itemStpselVal:undefined
    };
  },
  created() {},
  methods: {
    userNameChange(value) {
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
