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
        <a-form-model-item label="任务名称" prop="taskName">
          <a-input v-model="fields.taskName" />
        </a-form-model-item>
        <a-form-model-item label="项目步骤" prop="itemStepId">
          <!-- <a-input v-model="fields.itemStepId" /> -->
          <a-select
            :value="selVal"
            v-model="fields.itemStepId"
            placeholder="请选择项目步骤"
            @change="stepChange"
          >
            <a-select-option
              v-for="(item, index) in itemStepsOptions"
              :value="item.title"
              :key="index"
            >
              {{ item.title }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="任务成员" prop="member">
          <!-- <a-input v-model="fields.member" /> -->
          <a-select
            show-search
            v-model="fields.member"
            :value="memberselVal"
            placeholder="请选择任务成员"
            option-filter-prop="children"
            :filter-option="filterOption"
            @change="memberChange"
          >
            <a-select-option
              v-for="(item, index) in teamOptions"
              :value="item.name"
              :key="index"
            >
              {{ item.name }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="任务内容" prop="">
          <a-textarea
            v-model="fields.content"
            placeholder="任务内容..."
            :rows="4"
          />
        </a-form-model-item>
        <a-form-model-item label="结束时间" prop="endTime">
          <a-date-picker v-model="fields.endTime" />
        </a-form-model-item>
        <a-form-model-item label="是否开始" prop="isBegin">
          <!-- <a-input v-model="fields.isBegin" /> -->
          <!-- <a-switch v-model="fields.isBegin"/> -->
          <a-switch
            v-model="fields.beginSwitch"
            checked-children="是"
            un-checked-children="否"
            default-checked
          />
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
  name: "AssignTaskEdit",
  components: {},
  props: {
    visible: Boolean,
    iseditIdname: Boolean,
    title: {
      type: String,
      default: "派发任务",
    },
    okText: {
      type: String,
      default: "确定",
    },
    fields: Object,
    itemStepsOptions: Array,
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: "editForm" }),
      rules: {
        taskName: [
          { required: true, message: "请输入任务名称", trigger: "blur" },
        ],
        itemStepId: [
          { required: true, message: "请选择项目步骤", trigger: "blur" },
        ],
        member: [
          { required: true, message: "请选择任务成员", trigger: "blur" },
        ],
      },
      selVal: undefined,
      memberselVal: undefined,
      teamOptions: [],
    };
  },
  created() {
    this.teamOptions = this.$route.params.teams;
    console.log("团队成员：", this.teamOptions);
  },
  methods: {
    stepChange(value) {
      this.selVal = value;
      console.log(value);
    },

    memberChange(value) {
      console.log(`selected ${value}`);
      this.memberselVal = value;
    },

    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
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
