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
        <a-form-model-item label="员工姓名" prop="name">
          <a-input v-model="fields.name" disabled/>
        </a-form-model-item>
        <a-form-model-item label="用户角色" prop="role">
          <a-select
            :value="roleSelVal"
            v-model="fields.role"
            placeholder="请选择用户角色"
            @change="roleChange"
          >
            <a-select-option
              v-for="(item, index) in roleOptions"
              :value="item.name"
              :key="index"
            >
              {{ item.name }}
            </a-select-option>
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
                $emit('create', this.$refs.ruleForm,operationVal);
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
  name: "PersoninfoEdit",
  components: {},
  props: {
    visible: Boolean,
    iseditIdname: Boolean,
    title: {
      type: String,
      default: "用户新增",
    },
    okText: {
      type: String,
      default: "确定",
    },
    fields: Object,
    rules: Object,
    roleOptions:Array
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: "editForm" }),
      roleSelVal:undefined,
      operationVal:''
    };
  },
  created() {},
  methods: {
    roleChange(value){
      this.roleSelVal = value
      if(this.roleOptions.length>0){
        this.roleOptions.forEach(item=>{
        if(item.name == value){
          this.operationVal = item.operation
        }
      })
      }
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
