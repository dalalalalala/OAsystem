<template>
<div>
  <a-dropdown>
    <div class="header-avatar" style="cursor: pointer">
      <a-avatar class="avatar" size="small" shape="circle" :src="user.avatar"/>
      <span class="name">{{user.name}}</span>
    </div>
    <a-menu :class="['avatar-menu']" slot="overlay">
      <a-menu-item @click="personalGo">
        <a-icon type="user" />
        <span>个人中心</span>
      </a-menu-item>
      <a-menu-item @click="noteGo">
        <a-icon type="file-text" />
        <span>便签</span>
      </a-menu-item>
      <!-- <a-menu-item>
        <a-icon type="setting" />
        <span>设置</span>
      </a-menu-item> -->
      <a-menu-divider />
      <a-menu-item @click="logout">
        <a-icon style="margin-right: 8px;" type="poweroff" />
        <span>退出登录</span>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
  <a-modal
      :visible="visibleNote"
      title="便签"
      okText="确定"
      :fields="fields"
      @cancel="cancelModel"
      footer=""
    >
      <a-form-model
        ref="noteForm"
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
            @click="cancelModel"
          >
            取消
          </a-button>
          <a-button
            type="primary"
            @click="createNote"
          >
            确定
          </a-button>
        </a-form-model-item>
      </a-form-model>
    </a-modal>
</div>
  
</template>

<script>
// import MytaskList from '@/pages/mytask/MytaskList'
import {mapGetters} from 'vuex'
import {logout} from '@/services/user'
import {note} from "@/services/index";

export default {
  name: 'HeaderAvatar',
  computed: {
    ...mapGetters('account', ['user']),
  },
  data () {
    return {
      form: this.$form.createForm(this, { name: "noteForm" }),
      fields:{
        _id:'',
        createUser:'',
        noteTitle:'',
        noteContent:'',
        createTime:''
      },
      visibleNote:false,
      rules: {
        noteTitle: [
          { required: true, message: "请输入便签标题", trigger: "blur" }
        ],
        noteContent: [
          { required: true, message: "请输入便签标题", trigger: "blur" }
        ],
      },  
    }
  },
  methods: {
    logout() {
      logout()
      this.$router.push('/login')
    },
    personalGo(){
      this.$router.push('/personal')
    },
    noteGo(){
      console.log('便签')
      this.visibleNote=true
    },
    cancelModel(){
      this.visibleNote=false
    },
     reset() {
      this.fields={
        _id:'',
        createUser:'',
        noteTitle:'',
        noteContent:'',
        createTime:''
      }
    },
    createNote(){
     this.$refs.noteForm.validate((valid) => {
        if (valid) {
          note.edit(this.fields).then((res) => {
            if (res.data.code == 1) {
              this.$message.success("操作成功");
            } else {
              this.$message.error("操作失败");
            }
            this.visibleNote = false;
            this.reset();
            let noteStatus = this.$store.state.note.noteAddStatus; 
        this.$store.commit("note/changenoteStatus", !noteStatus);
            // MytaskList.methods.list()
          });
        } else {
           this.$message.error("请正确填写信息")
        }
      });
      console.log(this.fields)
    }
  }
}
</script>

<style lang="less">
  .header-avatar{
    display: inline-flex;
    .avatar, .name{
      align-self: center;
    }
    .avatar{
      margin-right: 8px;
    }
    .name{
      font-weight: 500;
    }
  }
  .avatar-menu{
    width: 150px;
  }

</style>
