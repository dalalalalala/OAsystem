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
        <a-form-model-item label="申请类型" prop="type">
          <a-select
          
            :value="selVal"
            v-model="fields.type"
            placeholder="请选择申请内容类型"
            @change="typeChange"
          >
            <a-select-option
              v-for="(item, index) in typeOptions"
              :value="item.name"
              :key="index"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remarks">
          <a-input  placeholder="请输入备注" v-model="fields.remarks" />
        </a-form-model-item>
        <a-form-model-item label="时间" prop="endValidity">
          <a-range-picker  :default-value="[]" :value="fields.beginValidity==''?null:[moment(fields.beginValidity, 'YYYY-MM-DD'),moment(fields.endValidity, 'YYYY-MM-DD')]" @change="(date,dateString) => {
                $emit('dateChange',date,dateString);
              }" />
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
import moment from 'moment'
export default {
  name: "InstitutionEdit",
  components: {},
  props: {
    visible: Boolean,
    iseditIdname: Boolean,
    title: {
      type: String,
      default: "申请审批",
    },
    okText: {
      type: String,
      default: "确定",
    },
    fields: Object
  },
  data() {
    return {
      moment,
      form: this.$form.createForm(this, { name: "editForm" }),
      selVal:undefined,
      typeOptions:[
        {name:'请假'},
        {name:'出差'}
      ],
       rules: {
        type: [
          { required: true, message: "请选择申请内容类型", trigger: "blur" }
        ],
        beginValidity: [
          { required: true, message: "请输入开始有效时间", trigger: "change" }
        ],
        endValidity: [
          { required: true, message: "请输入结束有效时间", trigger: "change" }
        ]
      },
    };
  },
  created() {},
  methods: {
    typeChange(value) {
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
