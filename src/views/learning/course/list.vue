<template>
  <div class="app-container">
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">

      <!-- 标题 -->
      <el-form-item label="课程名称">
        <el-input v-model="searchObj.title" placeholder="课程标题"/>
      </el-form-item>

      <!-- 讲师 -->
      <el-form-item label="讲师姓名">
        <el-select
          v-model="searchObj.teacherId"
          filterable
          placeholder="请选择讲师">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="searchObj.categoryParentId"
          placeholder="请选择"
          @change="categoryLevelOneChanged">
          <el-option
            v-for="category in categoryNestedList"
            :key="category.id"
            :label="category.title"
            :value="category.id"/>
        </el-select>

        <!-- 二级分类 -->
        <el-select v-model="searchObj.categoryId" placeholder="请选择">
          <el-option
            v-for="category in subCategoryList"
            :key="category.id"
            :label="category.title"
            :value="category.id"/>
        </el-select>
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" icon="el-icon-delete" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row
      row-class-name="myClassList">

      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="课程信息" width="470" align="center">
        <template slot-scope="scope">
          <div class="info">
            <div class="pic">
              <img :src="scope.row.cover" alt="图片加载失败" width="150px">
            </div>
            <div class="title">
              <a href="#">{{ scope.row.title }}</a>
              <p>{{ scope.row.lessonNum }}课时</p>
            </div>
          </div>

        </template>
      </el-table-column>
      <el-table-column label="状态" >
        <template slot-scope="scope">
          <span v-if="scope.row.status === 'Provisional'"> 临时课程 </span>
          <span v-if="scope.row.status === 'Normal'"> 已发布 </span>
          <span v-if="scope.row.status === 'Draft'"> 已暂存 </span>
        </template>
      </el-table-column>
      <el-table-column label="讲师">
        <template slot-scope="scope">
          <ul
            v-for="teacher in teacherList"
            :key="teacher.id" >
            <li v-if="teacher.id === scope.row.teacherId">
              {{ teacher.name }}
            </li>
          </ul>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
          {{ scope.row.createTime }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <router-link v-if="scope.row.status !== 'Normal'" :to="'/learning/course/add/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
          </router-link>
          <router-link v-if="scope.row.status !== 'Normal'" :to="'/learning/course/chapter/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
          <router-link v-if="scope.row.status !== 'Normal'" :to="'/learning/course/publish/'+scope.row.id">
            <el-button type="text" size="mini" icon="el-icon-edit">发布课程</el-button><br>
          </router-link>
          <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteCourse(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-if="total > limit"
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="fetchData"
    />
  </div>
</template>

<script>
import course from '@/api/learning/course'
import teacher from '@/api/learning/teacher'
import category from '@/api/learning/category'

export default {

  data() {
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 页码
      limit: 5, // 每页记录数
      searchObj: {
        categoryParentId: '',
        categoryId: '',
        title: '',
        teacherId: ''
      },
      teacherList: [], // 讲师列表
      categoryNestedList: [], // 一级分类列表
      subCategoryList: [] // 二级分类列表,
    }
  },

  created() {
    // 初始化分类列表
    this.initCategoryList()
    // 获取讲师列表
    this.initTeacherList()
    // 获取课程数据
    this.fetchData()
  },

  methods: {
    // 获取数据
    fetchData(page = 1) {
      // 解决分页无效问题
      this.page = page
      this.listLoading = true
      course.getPageList(this.page, this.limit, this.searchObj)
        .then(response => {
          if (response.success === true) {
            this.list = response.data.rows
            this.total = response.data.total
          }
          this.listLoading = false
        })
    },

    // 初始化讲师列表
    initTeacherList() {
      teacher.getAllTeacher()
        .then(response => {
          this.teacherList = response.data.teacherList
          console.log(this.teacherList)
        })
    },
    // 初始化课程分类列表
    initCategoryList() {
      category.getTreeList()
        .then(response => {
          this.categoryNestedList = response.data.items
        })
    },

    // 课程分类二级分类显示
    categoryLevelOneChanged(value) {
      for (let i = 0; i < this.categoryNestedList.length; i++) {
        if (this.categoryNestedList[i].id === value) {
          this.subCategoryList = this.categoryNestedList[i].children
          this.searchObj.categoryId = ''
        }
      }
    },

    // 删除课程方法
    deleteCourse(courseId) {
      // 弹个确认框做操作
      this.$confirm('此操作将永久删除该记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '返回',
        type: 'warning'
      })
        .then(() => {
          course.deleteCourseById(courseId)
            .then(response => {
              // 提示成功
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              // 刷新数据
              this.fetchData()
            })
            .catch(response => {
              // 提示失败
              this.$message({
                type: 'error',
                message: response.data.message
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // 重置数据
    resetData() {
      this.searchObj = {}
      this.subCategoryList = [] // 二级分类列表
      this.fetchData()
    }
  }
}
</script>

<style scoped>
.myClassList .info {
    width: 450px;
    overflow: hidden;
}
.myClassList .info .pic {
    width: 150px;
    height: 90px;
    overflow: hidden;
    float: left;
}
.myClassList .info .pic a {
    display: block;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
}
.myClassList .info .pic img {
    display: block;
    width: 100%;
}
.myClassList td .info .title {
    width: 280px;
    float: right;
    height: 90px;
}
.myClassList td .info .title a {
    display: block;
    height: 48px;
    line-height: 24px;
    overflow: hidden;
    color: #00baf2;
    margin-bottom: 12px;
}
.myClassList td .info .title p {
    line-height: 20px;
    margin-top: 5px;
    color: #818181;
}
</style>
