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
        <a-form-model-item label="转接成员" prop="transferMember">
          <a-select
          :value="selVal"
          placeholder="请选择转接成员"
          @change="selectChange"
          v-model="fields.transferMember"
        >
          <a-select-option
            :value="item.name"
            v-for="(item, index) in teams"
            :key="index"
            >{{ item.name }}</a-select-option
          >
        </a-select>
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
      default: "转接成员",
    },
    okText: {
      type: String,
      default: "确定",
    },
    fields: Object,
    // transferMember:String,
    teams:Array
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: "editForm" }),
      rules: {
        transferMember: [
          { required: true, message: "请选择转接成员",trigger: "blur"  },
        ],
      },
      selVal:null
    };
  },
  created() {},
  methods: {
    selectChange(value) {
      this.selVal = value;
      console.log(this.teams)
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
