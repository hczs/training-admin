<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="3" style="margin-bottom: 40px;" process-status="wait" align-center>
      <el-step title="填写课程基本信息" icon="el-icon-edit"/>
      <el-step title="创建课程大纲上传课程视频" icon="el-icon-upload"/>
      <el-step title="确认信息并发布" icon="el-icon-circle-check"/>
    </el-steps>

    <div class="courseInfo">
      <img :src="coursePublish.cover">
      <div class="main">
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray"><span>共{{ coursePublish.lessonNumber }}课时</span></p>
        <p><span>课程分类：{{ coursePublish.categoryOne }} — {{ coursePublish.categoryTwo }}</span></p>
        <p>所属讲师：{{ coursePublish.teacherName }}</p>
        <!-- <div>课程简介：<div v-html="coursePublish.description" /> </div> -->
      </div>
    </div>

    <div>
      <el-button @click="previous">返回修改</el-button>
      <el-button type="info" @click="save">暂存课程</el-button>
      <el-button type="primary" @click="publish">发布课程</el-button>
    </div>
  </div>
</template>

<script>
import course from '@/api/learning/course.js'
export default {
  data() {
    return {
      courseId: '',
      coursePublish: {}
    }
  },

  created() {
    this.init()
  },

  methods: {

    // 初始化课程信息
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        // 回显准备发布的课程信息
        course.getCoursePublishInfo(this.courseId)
          .then(response => {
            this.coursePublish = response.data.coursePublish
          })
      }
    },

    // 课程发布方法
    publish() {
      course.publishCourse(this.courseId)
        .then(response => {
          // 提示发布成功
          this.$message({
            type: 'success',
            message: '课程发布成功！'
          })
          // 跳转页面
          this.$router.push({ path: '/learning/course/list' })
        })
        .catch(response => {
          // 提示失败
          this.$message({
            type: 'error',
            message: response.data.message
          })
        })
    },

    // 课程暂存
    save() {
      course.savePublishCourse(this.courseId)
        .then(response => {
          // 提示暂存成功
          this.$message({
            type: 'success',
            message: '课程已暂存！'
          })
          // 跳转页面
          this.$router.push({ path: '/learning/course/list' })
        })
        .catch(response => {
          // 提示失败
          this.$message({
            type: 'error',
            message: response.data.message
          })
        })
    },

    // 上一步
    previous() {
      this.$router.push({ path: '/learning/course/chapter/' + this.courseId })
    }
  }
}
</script>

<style scoped>
.courseInfo {
    background: #f5f5f5;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
}
.courseInfo img {
    background: #d6d6d6;
    width: 500px;
    height: 278px;
    display: block;
    float: left;
    border: none;
}
.courseInfo .main {
    margin-left: 520px;
}

.courseInfo .main h2 {
    font-size: 28px;
    margin-bottom: 30px;
    line-height: 1;
    font-weight: normal;
}
.courseInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}

.courseInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.courseInfo .main h3 {
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;
}
</style>
