<template>
  <div>
    <a-modal
      :visible="visible"
      :title="title"
      :okText="okText"
      :fields="fields"
      @cancel="
        () => {
          $emit('cancel');
        }
      "
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
        <a-form-model-item label="权限名称" prop="limitName">
          <a-input v-model="fields.limitName" />
        </a-form-model-item>
        <a-form-model-item label="禁用模块" prop="limitMenu">
          <!-- <a-input v-model="fields.limitMenu" /> -->
          <a-select
            mode="multiple"
            :value="selVal"
            v-model="fields.limitMenu"
            placeholder="请选择禁用模块"
            @change="limitMenuChange"
          >
            <a-select-option
              v-for="(item, index) in routerMenu"
              :value="item.name"
              :key="index"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="权限描述" prop="limitDesc">
          <a-input v-model="fields.limitDesc" />
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
      default: "权限新增",
    },
    okText: {
      type: String,
      default: "确定",
    },
    fields: Object,
    rules: Object,
    routerMenu: Array,
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: "editForm" }),
      userNameselVal: undefined,
      itemStpselVal: undefined,
      selVal:undefined
    };
  },
  created() {},
  methods: {
    limitMenuChange(value) {
      this.selVal=value
      console.log(this.selVal)
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
