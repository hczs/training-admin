<template>
  <div class="app-container">
    <!-- 顶部查询表单 -->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item label="计划名称">
        <el-input v-model="planQuery.name" placeholder="计划名称" />
      </el-form-item>

      <el-form-item label="负责人">
        <el-select
          v-model="planQuery.teacherId"
          filterable
          placeholder="请选择计划负责人">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

      <el-form-item label="开始时间">
        <el-date-picker
          v-model="planQuery.beginTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="planQuery.endTime"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" icon="el-icon-delete" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 讲师列表显示 -->
    <el-table
      v-loading="listLoading"
      :data="planList"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="计划名称" width="80" />

      <el-table-column prop="purpose" label="计划目的" />

      <el-table-column label="计划负责人">
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

      <el-table-column prop="content" label="计划内容" />

      <el-table-column label="状态" >
        <template slot-scope="scope">
          <span v-if="scope.row.status === 'Normal'"> 已发布 </span>
          <span v-if="scope.row.status === 'Draft'"> 已暂存 </span>
        </template>
      </el-table-column>

      <el-table-column prop="beginTime" label="开始时间" width="160"/>

      <el-table-column prop="endTime" label="结束时间" width="160"/>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/plan/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
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
import teacher from '@/api/learning/teacher'
import plan from '@/api/plan/plan'

export default {

  data() {
    return {
      listLoading: true, // 是否显示loading信息
      planList: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 当前页
      limit: 8, // 每页记录数
      planQuery: {}, // 查询条件封装对象
      teacherList: [] // 讲师列表
    }
  },

  created() {
    this.fetchData()
    this.initTeacherList()
  },

  methods: {
    // 获取计划列表
    fetchData(page = 1) {
      this.page = page
      this.listLoading = true
      plan.getPagePlanList(this.page, this.limit, this.planQuery)
        .then(response => {
          this.planList = response.data.rows
          this.total = response.data.total
        })
        .catch(error => {
          console.log(error)
        })
      this.listLoading = false
    },

    // 初始化讲师列表
    initTeacherList() {
      teacher.getAllTeacher()
        .then(response => {
          this.teacherList = response.data.teacherList
          console.log(this.teacherList)
        })
    },

    // 清空数据
    resetData() {
      this.planQuery = {}
      this.fetchData()
    },

    removeDataById(id) {
      this.$confirm('此操作将永久删除该计划, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          plan.deletePlanById(id)
            .then(response => {
              console.log(response)
              // 刷新数据
              this.fetchData()
            })
            .catch(error => {
              console.log(error)
            })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>
