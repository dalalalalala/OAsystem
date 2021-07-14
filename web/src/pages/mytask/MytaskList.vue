<template>
  <page-layout :avatar="currUser.avatar">
    <div slot="headerContent">
      <div class="title">
        {{ welcome.timeFix[lang] }}，{{ currUser.name }}，{{
          welcome.message[lang]
        }}
      </div>
    </div>
    <template slot="extra">
      <head-info
        class="split-right"
        :title="$t('项目数量')"
        :content="projectTotal"
      />
      <head-info class="split-right" :title="$t('任务总数量')" :content="currUser.tasksTotal" />
    </template>
    <template>
      <a-row style="margin: 0 -12px">
        <a-col
          style="padding: 0 12px"
          :xl="16"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <a-card
            class="project-list"
            :loading="loading"
            style="margin-bottom: 24px"
            :bordered="false"
            :title="$t('项目')"
            :body-style="{ padding: 0 }"
          >
            <div>
              <a-card-grid
                style="cursor: pointer"
                :key="i"
                v-for="(item, i) in projectItem"
                @click="projectItemClick(item._id)"
              >
                <a-card :bordered="false" :body-style="{ padding: 0 }">
                  <a-card-meta>
                    <div slot="title" class="card-title">
                      <a-avatar
                        size="small"
                        src="http://localhost:5001/public/icon/projectLogo.png"
                      />
                      <span>{{ item.itemName }}</span>
                    </div>
                    <div slot="description">
                      <p style="margin: 0">项目类型：{{ item.type }}</p>
                      <span>{{ item.duty }}</span>
                    </div>
                  </a-card-meta>
                  <div class="project-item">
                    <!-- <a class="group" href="/#/">科学</a> -->
                    <span class="datetime">{{moment(item.endTime).format('YYYY-MM-DD') }}</span>
                  </div>
                </a-card>
              </a-card-grid>
            </div>
            <a-empty
            style="margin:26px 0;"
              description="暂无参与项目"
              v-show="projectItem.length == 0"
            />
          </a-card>
          <a-card :loading="loading" :title="$t('项目动态')" :bordered="false">
            <a-list>
              <a-list-item :key="index" v-for="(item, index) in projectActive" v-show="item.operPlace=='在项目中'">
                <a-list-item-meta>
                  <a-avatar slot="avatar" :src="item.avatar" />
                  <div slot="title">
                    <span style="margin-right:6px">{{item.operator}}</span>
                    <a href="javascript:void(0)" style="margin-right:6px;cursor:auto;">{{item.operPlace}}</a>
                    <span style="margin-right:6px">{{item.operAction}}</span>
                    <a style="margin-right:6px">{{item.operContent}}</a>
                    <span>项目</span>
                  </div>
                  <div slot="description">{{moment(item.operTime).format('YYYY-MM-DD HH:MM:SS')}}</div>
                </a-list-item-meta>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
        <a-col
          style="padding: 0 12px"
          :xl="8"
          :lg="24"
          :md="24"
          :sm="24"
          :xs="24"
        >
          <a-card
            :loading="loading"
            title="便签"
            style="margin-bottom: 24px"
            :bordered="false"
          >
            <!-- <div style="min-height: 400px;">
              <radar />
            </div> -->
            <h6>共计 {{ noteData.length }} 条便签</h6>
            <a-list
              class="note-list"
              item-layout="horizontal"
              :data-source="noteData"
            >
              <a-list-item slot="renderItem" slot-scope="item">
                <a-comment
                  :author="item.noteTitle"
                  avatar="http://localhost:5001/public/icon/note.png"
                >
                  <template slot="actions">
                    <span @click="editUI(item._id)">编辑</span>
                    <span @click="remove(item._id)">删除</span>
                  </template>
                  <p slot="content">
                    {{ item.noteContent }}
                  </p>
                  <a-tooltip slot="datetime" :title="item.createTime">
                    <!-- <span>{{ item.createTime }}</span> -->
                    <span>{{ moment(item.createTime).fromNow() }}</span>
                  </a-tooltip>
                </a-comment>
              </a-list-item>
            </a-list>
          </a-card>
        </a-col>
      </a-row>
    </template>

    <NoteEdit
      ref="editForm"
      :title="noteEditTitle"
      :visible="visibleNote"
      :fields="noteFields"
      @cancel="cancelModal"
      @create="noteEdit"
    />
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
import HeadInfo from "@/components/tool/HeadInfo";
import NoteEdit from "./NoteEdit";
import { mapState } from "vuex";
import { request, METHOD } from "@/utils/request";
import { note, projectinfo,operation } from "@/services/index";
import { dateFormat } from "@/utils/dataFormat";
import moment from "moment";
export default {
  name: "WorkPlace",
  components: { HeadInfo, PageLayout, NoteEdit },
  data() {
    return {
      moment,
      projects: [],
      loading: true,
      teams: [],
      visibleNote: false,
      noteEditTitle: "",
      noteData: [],
      noteFields: {
        _id: "",
        createUser: "",
        noteTitle: "",
        noteContent: "",
        createTime: "",
      },
      welcome: {
        timeFix: "",
        message: "",
      },
      projectItem: [],
      projectTotal: "",
      projectActive:[]
    };
  },
  computed: {
    ...mapState("account", { currUser: "user" }),
    ...mapState("setting", ["lang"]),
    noteStatus() {
      //  计算属性
      return this.$store.state.note.noteAddStatus; //  Vuex 中定义的属性
    },
  },
  watch: {
    noteStatus() {
      this.list();
    },
  },
  created() {
    this.list();
    this.activeList()
    this.projectByuserName();
    console.log(this.currUser.avatar);
    request("/user/welcome", METHOD.GET).then((res) => {
      this.welcome = res.data;
      console.log(res);
    });
    request("/work/team", METHOD.GET).then((res) => (this.teams = res.data));
    request("/project", METHOD.GET).then((res) => {
      this.projects = res.data;
      this.loading = false;
    });
  },
  methods: {
    activeList() {
      operation.list().then((res) => {
        if (res.data.code === 1) {
          this.projectActive = res.data.data
          console.log('活动动态：',res);
        }
      });
    },
    projectByuserName() {
      projectinfo.getByuserName().then((res) => {
        if (res.data.code === 1) {
          console.log(res);
          this.projectItem = res.data.data;
          this.projectTotal = res.data.total;
          this.loading = false;
        }
      });
    },
    projectItemClick(itemId) {
      console.log(itemId);
      this.$router.push({
        path: "/taskwork/taskcom",
        query: { itemId: itemId },
      });
    },
    reset() {
      this.noteFields = {
        _id: "",
        createUser: "",
        noteTitle: "",
        noteContent: "",
        createTime: "",
      };
    },
    editUI(id) {
      this.visibleNote = true;
      this.loading = true;
      this.noteEditTitle = "便签编辑";
      note.getByid({ id: id }).then((res) => {
        if (res.data.code === 1) {
          this.noteFields = res.data.data;
          this.visible = true;
        } else {
          this.$message.error("获取失败 " + res.data.msg);
        }
      });
      this.loading = false;
    },
    list() {
      this.loading = true;
      note.list().then((res) => {
        if (res.data.code === 1) {
          console.log(res);
          // const pagination = { ...this.pagination };
          // pagination.total = res.data.total;
          let noteData = res.data.data.map((item) => {
            item.createTime = dateFormat(item.createTime);
            return item;
          });
          this.noteData = noteData;
          console.log(this.noteData);
          // this.pagination = pagination;
        }
        this.loading = false;
      });
    },
    remove(id) {
      this.loading = true;
      note.remove({ id: id }).then((res) => {
        this.loading = false;
        if (res.data.code === 1) {
          this.$message.success(res.data.msg);
          this.list();
        } else {
          this.$message.error(res.data.msg);
        }
      });
      this.loading = false;
    },
    noteEdit(validfn) {
      validfn.validate((valid) => {
        if (valid) {
          note.edit(this.noteFields).then((res) => {
            if (res.data.code == 1) {
              this.$message.success("操作成功");
            } else {
              this.$message.error("操作失败");
            }
            this.visibleNote = false;
            this.reset();
            this.list();
          });
        } else {
          this.$message.error("请正确填写信息");
        }
      });
      console.log(this.noteFields);
    },
    cancelModal() {
      this.visibleNote = false;
    },
  },
};
</script>

<style lang="less">
@import "index";
</style>
