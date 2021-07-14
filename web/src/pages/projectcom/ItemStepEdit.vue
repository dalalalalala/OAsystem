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
        <a-form-model-item label="步骤标题" prop="title">
          <a-input v-model="fields.title" />
        </a-form-model-item>
        <a-form-model-item label="结束时间" prop="endTime">
          <a-date-picker v-model="fields.endTime" />
        </a-form-model-item>
        <a-form-model-item label="步骤状态" prop="status">
          <!-- <a-input v-model="fields.status" /> -->
          <a-select
          :value="selVal"
          placeholder="请选择步骤状态"
          @change="selectChange"
          v-model="fields.status"
        >
          <a-select-option
            :value="item.type"
            v-for="(item, index) in statusOptions"
            :key="index"
            >{{ item.name }}</a-select-option
          >
        </a-select>
        </a-form-model-item>
        <a-form-model-item label="步骤描述" prop="description">
          <a-input v-model="fields.description" />
        </a-form-model-item>
        <a-form-model-item label="步骤内容" prop="content">
          <!-- <a-input v-model="fields.content" /> -->
          <a-textarea v-model="fields.content" placeholder="步骤内容..." :rows="4" />
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
      default: "步骤新增",
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
    rules: {
      title: [
          { required: true, message: "请输入步骤标题", trigger: "blur" },
        ],
        endTime:[
          { required: true, message: "请输入结束时间", trigger: "change" },
        ]
        
    },
    statusOptions:[
      {name:'未开始',type:'wait'},
      {name:'进行中',type:'process'},
      {name:'已完成',type:'finish'},
      {name:'已逾期',type:'error'}
    ],
      selVal:undefined
    };
  },
  created() {},
  methods: {
    userNameChange(value) {
      console.log(`selected ${value}`);
    },
    selectChange(value) {
      this.selVal = value;
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
