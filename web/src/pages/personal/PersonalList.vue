<template>
  <div class="page">
    <a-card>
      <div>
      <a-form-model :model="fields" :form="form" :rules="rules" v-bind="layout">
        <a-form-model-item label="姓名" prop="name">
          <a-input v-model="fields.name" />
        </a-form-model-item>
        <a-form-model-item label="用户名" prop="alias">
          <a-input v-model="fields.alias" />
        </a-form-model-item>
        <a-form-model-item label="邮箱" prop="email">
          <a-input v-model="fields.email" />
        </a-form-model-item>
        <a-form-model-item label="手机号" prop="phone">
          <a-input v-model="fields.phone" />
        </a-form-model-item>
        <a-form-model-item label="角色" prop="role">
          <a-input disabled v-model="fields.role"/>
        </a-form-model-item>
        <a-form-model-item label="头像" prop="avatar">
          <a-upload
      action="/api/personal/uploadImg"
      list-type="picture-card"
      :file-list="fileList"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < 1">
        <a-icon type="plus" />
        <div class="ant-upload-text">
          Upload
        </div>
      </div>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </a-modal>

        </a-form-model-item>
        <a-form-model-item :wrapper-col="{ span: 4, offset: 17 }">
          <a-button type="primary" @click="edit"> 确定 </a-button>
        </a-form-model-item>
      </a-form-model>
    </div>
    </a-card>
    
  </div>
</template>

<script>
import { personal } from "@/services/index";
import { mapMutations } from "vuex";
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
export default {
  name: "PersonalList",
  components: {},
  data() {
    return {
      headers: {
        authorization: 'authorization-text',
      },
      previewVisible: false,
      previewImage: '',
      fileList: [],
      form: this.$form.createForm(this, { name: "editForm" }),
      fields: {
        id: "",
        role:"",
        name:"",
        email:"",
        avatar:"",
        alias: "",
        phone:"",
      },
      layout: {
        labelCol: { span: 5 },
        wrapperCol: { span: 14 },
      },
      rules: {
        name: [
          { required: true, message: "请输入名字", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {message: "请输入正确邮箱",pattern: new RegExp('^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$')}
        ],
        alias: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {message: "请输入正确手机号",pattern: new RegExp('^1[3|4|5|7|8][0-9]{9}$')}
        ]
      },
    };
  },
  created () {
    this.editUI()
  },
  methods: {
    ...mapMutations("account", ["setUser"]),
    handleCancel() {
      this.previewVisible = false;
    },
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handleChange(info) {
      this.fileList = info.fileList;
      console.log(info)
      if(info.file.status ==='done'){
        if(info.file.response.code==1){
          console.log(info.file.response.data)
          this.fields.avatar = info.file.response.data
        }
      }
    },
    reset() {
      this.fields = {
        id: "",
        role:"",
        name:"",
        email:"",
        avatar:"",
        alias: "",
        phone:"",
      };
    },
    editUI(){
      this.fields = JSON.parse(localStorage.getItem('admin.user')) 
      this.fileList = [
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: this.fields.avatar,
        }
      ]
    },
    edit() {
      console.log(this.fields)
      personal.edit(this.fields).then(res=>{
        console.log(res)
        if(res.data.code===1){
          this.$message.success(res.data.msg)
          let user = res.data.data
          this.setUser(user)
        }
      })
      // menu.edit(this.fields).then((res) => {
      //   if (res.data.code === 1) {
      //     this.$message.success("保存菜单成功");
      //     this.visible = false;
      //     this.reset;
      //     this.$emit('treeList')
      //   } else {
      //     this.$message.error("保存失败 " + res.data.msg);
      //   }
      // });
    }
  },
};
</script>

<style lang="less" scoped></style>
