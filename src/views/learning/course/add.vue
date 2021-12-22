<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" style="margin-bottom: 40px;" process-status="wait" align-center>
      <el-step title="填写课程基本信息" icon="el-icon-edit"/>
      <el-step title="创建课程大纲上传课程视频" icon="el-icon-upload"/>
      <el-step title="确认信息并发布" icon="el-icon-circle-check"/>
    </el-steps>

    <el-form label-width="120px">

      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/oss/file/upload'"
          class="avatar-uploader">
          <img :src="courseInfo.cover" class="avatar" alt="点击更换">
        </el-upload>

      </el-form-item>
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder=" 示例：公司制度基本培训课程"/>
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.categoryParentId"
          placeholder="请选择"
          @change="categoryLevelOneChanged">
          <el-option
            v-for="category in categoryNestedList"
            :key="category.id"
            :label="category.title"
            :value="category.id"/>
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="courseInfo.categoryId" placeholder="请选择">
          <el-option
            v-for="category in subCategoryList"
            :key="category.id"
            :label="category.title"
            :value="category.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          filterable
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="课程的总课时数"/>
      </el-form-item>

      <!-- 课程简介 TODO -->
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import category from '@/api/learning/category.js'
import teacher from '@/api/learning/teacher.js'
import course from '@/api/learning/course.js'
import Tinymce from '@/components/Tinymce'

export default {
  components: { Tinymce },
  data() {
    return {
      courseInfo: {
        id: '',
        cover: '',
        title: '',
        categoryId: '',
        categoryParentId: '',
        teacherId: '',
        lessonNum: 0,
        description: ''
      },
      BASE_API: process.env.BASE_API,
      categoryNestedList: [],
      subCategoryList: [],
      teacherList: [],
      saveBtnDisabled: false
    }
  },

  created() {
    this.getCategoryTreeList()
    this.init()
    // 赋值默认封面
    this.courseInfo.cover = 'http://hsunnyc.oss-cn-beijing.aliyuncs.com/cover/cover.png'
  },

  methods: {
    // 初始化课程信息，课程分类信息，讲师信息
    init() {
      if (this.$route.params && this.$route.params.id) {
        course.getCourseInfo(this.$route.params.id)
          .then(response => {
            this.courseInfo = response.data.course
            console.log(this.courseInfo)
            console.log(this.categoryNestedList)
            // 初始化二级分类信息回显
            // 遍历找到对应值，取出其子列表
            for (let i = 0; i < this.categoryNestedList.length; i++) {
              console.log(this.categoryNestedList[i].id)
              if (this.categoryNestedList[i].id === this.courseInfo.categoryParentId) {
                console.log('hehe')
                this.subCategoryList = this.categoryNestedList[i].children
              }
            }
            console.log(this.subCategoryList)
          })
      }
      // 获取课程分类及讲师信息
      this.getCategoryTreeList()
      this.getTeacherList()
    },
    // 获取课程分类数据
    getCategoryTreeList() {
      category.getTreeList()
        .then(response => {
          this.categoryNestedList = response.data.items
        })
    },
    // 获取讲师列表数据
    getTeacherList() {
      teacher.getAllTeacher()
        .then(response => {
          this.teacherList = response.data.teacherList
        })
    },
    // 课程封面上传成功后的方法
    handleAvatarSuccess(res) {
      this.courseInfo.cover = res.data.url
    },
    // 课程封面上传之前检测格式
    beforeAvatarUpload(file) {
      const isJPGorPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJPGorPng) {
        this.$message.error('上传图片的格式只能为jpg或者png！')
        return false
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M && isJPGorPng
    },

    // 课程一级分类改变了之后
    categoryLevelOneChanged(value) {
      // 遍历找到对应值，取出其子列表
      for (let i = 0; i < this.categoryNestedList.length; i++) {
        if (this.categoryNestedList[i].id === value) {
          this.subCategoryList = this.categoryNestedList[i].children
          // 这一步清空是为了选中一级分类，二级分类的框中应该是没有值的
          this.courseInfo.categoryId = ''
        }
      }
    },
    // 保存方法
    saveData() {
      course.addCourse(this.courseInfo).then(response => {
        this.$message({
          type: 'success',
          message: '保存成功!'
        })
        return response// 将响应结果传递给then
      }).then(response => {
        this.$router.push({ path: '/learning/course/chapter/' + response.data.courseId })
      }).catch((response) => {
        this.$message({
          type: 'error',
          message: response.message
        })
      })
    },
    // 更新方法
    updateData() {
      course.updateCourse(this.courseInfo)
        .then(response => {
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          this.$router.push({ path: '/learning/course/chapter/' + this.courseInfo.id })
        }).catch((response) => {
          this.$message({
            type: 'error',
            message: response.message
          })
        })
    },
    // 点击下一步按钮执行保存或更新
    saveOrUpdate() {
      if (this.$route.params && this.$route.params.id) {
        this.courseInfo.id = this.$route.params.id
        this.updateData()
      } else {
        this.saveData()
      }
    }
  }
}
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 338px;
    height: 208px;
    display: block;
  }
</style>
