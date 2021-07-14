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
        <a-form-model-item label="标题" prop="noteTitle">
          <a-input v-model="fields.noteTitle" />
        </a-form-model-item>
        <a-form-model-item label="内容" prop="noteContent">
          <a-textarea placeholder="请填写便签内容" v-model="fields.noteContent" :rows="4" />
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
  name: "NoteEdit",
  components: {},
  props: {
    visible: Boolean,
    iseditIdname: Boolean,
    title: {
      type: String,
      default: "便签新增",
    },
    okText: {
      type: String,
      default: "确定",
    },
    fields: Object,
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: "editForm" }),
      userNameselVal:undefined,
      itemStpselVal:undefined,
      rules: {
        noteTitle: [
          { required: true, message: "请输入便签标题", trigger: "blur" }
        ],
        noteContent: [
          { required: true, message: "请输入便签标题", trigger: "blur" }
        ],
      },  
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
