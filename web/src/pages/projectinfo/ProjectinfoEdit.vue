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
        <a-form-model-item
          v-show="title != '项目新增'"
          label="唯一标识"
          prop="_id"
        >
          <a-input v-model="fields._id" disabled />
        </a-form-model-item>
        <a-form-model-item label="项目名称" prop="itemName">
          <a-input v-model="fields.itemName" />
        </a-form-model-item>
        <a-form-model-item label="项目成员" prop="userName">
          <!-- <a-input v-model="fields.userName" /> -->
          <a-select
            mode="multiple"
            v-model="userNameValmodel"
            style="width: 100%"
            placeholder="请选择项目成员"
            @change="userNameChange"
          >
            <a-select-option
              v-for="(item, index) in personinfoOptions"
              v-model="item.name"
              :key="index"
            >
              {{ item.name }}&nbsp;{{ "(" + item.role + ")" }}
            </a-select-option>
          </a-select>
        </a-form-model-item>
        <a-form-model-item label="项目类型" prop="type">
          <a-input v-model="fields.type" />
        </a-form-model-item>
        <a-form-model-item label="职责" prop="duty">
          <a-input v-model="fields.duty" />
        </a-form-model-item>
        <a-form-model-item label="结束时间" prop="endTime">
          <!-- <a-input v-model="fields.endTime" /> -->
          <a-date-picker v-model="fields.endTime" />
        </a-form-model-item>
        <a-form-model-item label="项目附件">
          <a-upload
            name="file"
            :multiple="true"
            :file-list="defaultFileList"
            action="/api/personal/uploadImg"
            @change="(info) => {
                $emit('file-change',info);
              }"
          >
            <a-button v-if="defaultFileList.length < 1"> <a-icon type="upload" />点击上传</a-button>
          </a-upload>
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
import { mapState } from "vuex";
export default {
  name: "ProjectinfoEdit",
  components: {},
  props: {
    visible: Boolean,
    iseditIdname: Boolean,
    title: {
      type: String,
      default: "项目新增",
    },
    okText: {
      type: String,
      default: "确定",
    },
    fields: Object,
    rules: Object,
    personinfoOptions: Array,
    userNameDefaultVal: Array,
    projectFile:Array
  },
  data() {
    return {
      form: this.$form.createForm(this, { name: "editForm" }),
      userNameselVal: undefined,
      itemStpselVal: undefined,
      userNameValmodel:this.userNameDefaultVal,
      defaultFileList:[],
    };
  },
  computed: {
    ...mapState("account", { currUser: "user" })
  },
  created() {},
  mounted() {
  },
  watch: {
    'fields._id':{
        deep:true,
        handler:function(){
          this.userNameValmodel=this.userNameDefaultVal
        }
      },
    fields(){
      if(this.fields.fileName==undefined||this.fields.fileName==''){
        this.defaultFileList = []
      }else{
        this.defaultFileList =  [
        {
          uid: '1',
          name: this.fields.fileName,
          status: 'done',
          response: 'Server Error 200',
          url: this.fields.filePath,
        }
      ]
      }      
    },
    projectFile(newVal){
      this.defaultFileList = newVal
    },
    title:function(newVal){
      if(newVal=='项目新增'){
        this.userNameChange()
        console.log('当前为项目新增')
      }
    }
  },
  methods: {
    reset(){
      this.userNameselVal = []
      console.log('重置内容')
    },
    userNameChange(value) {
      this.userNameselVal = [];
      if(this.title =='项目新增'){
        value = this.userNameValmodel
      }
      for (let i in value) {
        let splItem = value[i].trim().split(" ");
        this.personinfoOptions.forEach((item) => {
          if (item.name == splItem[0]) {
            this.userNameselVal.push({
              name: item.name,
              email: item.email,
              phone: item.phone,
              role: item.role,
              avatar: item.avatar,
            });
          }
        });
      }

      console.log("选中的值：", value);
      this.$emit("userNameSel", this.userNameselVal);
      console.log("保存的数据", this.userNameselVal);
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
