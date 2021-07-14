<template>
  <div>
    <a-modal
      :visible="visible"
      :fields="fields"
      :title="title"
      @cancel="() => {
                $emit('cancel');
              }"
      footer=""
    >
      <a-form-model
        ref="ruleForm"
        :model="fields"
        :form="form"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 16 }"
      >
        <a-form-model-item label="申请类型" prop="type">
          <span>{{fields.type}}</span>
        </a-form-model-item>
        <a-form-model-item label="备注" prop="remarks">
          <span>{{fields.remarks}}</span>
        </a-form-model-item>
        <a-form-model-item label="创建时间">
          <span>{{moment(fields.createTime).format('YYYY-MM-DD HH:MM:SS')}}</span>
        </a-form-model-item>
        <a-form-model-item label="时间" prop="endValidity">
          <span>{{fields.beginValidity}} ~ {{fields.beginValidity}}</span>
        </a-form-model-item>
        <a-form-model-item label="审批人" prop="remarks">
          <span>{{fields.approver==undefined?'无':fields.approver}}</span>
        </a-form-model-item>
        <a-form-model-item label="有效时长">
          <span>{{fields.validity}}</span>
        </a-form-model-item>
        <a-form-model-item label="状态">
          <span>{{fields.isapproved}}</span>
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
    fields: Object
  },
  data() {
    return {
      moment,
      form: this.$form.createForm(this, { name: "editForm" }),
      selVal:undefined,
      title:'审批详情'
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
