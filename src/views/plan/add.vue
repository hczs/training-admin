<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布培训计划</h2>

    <el-form label-width="130px">

      <el-form-item label="计划名称">
        <el-input v-model="plan.name" placeholder="示例：公司制度学习培训计划"/>
      </el-form-item>

      <el-form-item label="计划目的">
        <el-input v-model="plan.purpose" placeholder="请输入计划目的"/>
      </el-form-item>

      <el-form-item label="计划内容">
        <el-input v-model="plan.content" type="textarea" placeholder="请输入计划内容" />
      </el-form-item>

      <el-form-item label="计划分数">
        <el-input-number v-model="plan.score" :min="1" :max="100" label="请输入计划分数"/>
      </el-form-item>

      <el-form-item label="计划范围">
        <el-date-picker
          v-model="plan.date"
          size="medium"
          type="daterange"
          range-separator="——"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
      </el-form-item>

      <!-- 计划中包含课程 -->
      <el-form-item label="计划课程">
        <el-select v-model="plan.courses" style="width: 600px" filterable multiple placeholder="请选择">
          <el-option
            v-for="item in courseList"
            :key="item.id"
            :label="item.title"
            :value="item.id"/>
        </el-select>
      </el-form-item>

      <!-- 计划负责人（讲师） -->
      <el-form-item label="计划负责人">
        <el-select
          v-model="plan.teacherId"
          filterable
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <!-- 职工选择 -->
      <el-form-item label="职工选择">
        <el-select v-model="plan.staffs" style="width: 600px" filterable multiple placeholder="请选择">
          <el-option
            v-for="item in staffList"
            :key="item.id"
            :label="item.username"
            :value="item.id"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="info" @click="save">暂存计划</el-button>
        <el-button type="primary" @click="publish">发布计划</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>
<script>
import teacher from '@/api/learning/teacher'
import course from '@/api/learning/course'
import staff from '@/api/ucenter/staff'
import plan from '@/api/plan/plan'

export default {
  data() {
    return {
      plan: {},
      teacherList: [],
      courseList: [],
      staffList: []
    }
  },

  created() {
    // 只在有id的时候调用回显
    if (this.$route.params && this.$route.params.id) {
      // 调用回显
      this.getById(this.$route.params.id)
    } else {
      // 没有id的时候清空
      this.plan = {}
    }
    this.getTeacherList()
    this.getCourseList()
    this.getStaffList()
  },

  methods: {

    // 回显信息
    getById(id) {
      plan.getPlanInfo(id)
        .then(response => {
          this.plan = response.data.plan
        })
    },

    // 暂存计划
    save() {
      if (this.$route.params && this.$route.params.id) {
        plan.updateSavePlan(this.plan, this.$route.params.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '暂存计划成功!'
            })
            this.$router.push({ path: '/plan/list' })
          })
      } else {
        plan.savePlan(this.plan)
          .then(response => {
            this.$message({
              type: 'success',
              message: '暂存计划成功!'
            })
            this.$router.push({ path: '/plan/list' })
          })
      }
    },

    // 发布计划
    publish() {
      if (this.$route.params && this.$route.params.id) {
        plan.updateAddPlan(this.plan, this.$route.params.id)
          .then(response => {
            this.$message({
              type: 'success',
              message: '发布计划成功!'
            })
            this.$router.push({ path: '/plan/list' })
          })
      } else {
        plan.addPlan(this.plan)
          .then(response => {
            this.$message({
              type: 'success',
              message: '发布计划成功!'
            })
            this.$router.push({ path: '/plan/list' })
          })
      }
    },

    // 未使用
    saveOrUpdate() {
      plan.addPlan(this.plan)
        .then(response => {
          console.log(response)
        })
      console.log(this.plan)
    },

    // 获取讲师列表数据
    getTeacherList() {
      teacher.getAllTeacher()
        .then(response => {
          this.teacherList = response.data.teacherList
        })
    },

    // 获取课程列表数据（默认查询已暂存和已发布的课程）
    getCourseList() {
      course.getAllCourse()
        .then(response => {
          this.courseList = response.data.courseList
        })
    },

    // 获取职工列表数据
    getStaffList() {
      staff.getAllStaff()
        .then(response => {
          this.staffList = response.data.staffList
        })
    }
  }
}
</script>
