<template>
  <div class="app-container">
    <!-- 顶部查询表单 -->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item label="讲师姓名">
        <el-input v-model="teacherQuery.name" placeholder="讲师姓名" />
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="teacherQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-form-item>
        <el-date-picker
          v-model="teacherQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
      <el-button type="default" icon="el-icon-delete" @click="resetData()">清空</el-button>
    </el-form>

    <!-- 讲师列表显示 -->
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column prop="name" label="名称" width="80" />

      <el-table-column prop="introduce" label="讲师简介" />

      <el-table-column prop="createTime" label="添加时间" width="160"/>;

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/learning/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 分页 -->
    <el-pagination
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
export default {

  data() {
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 当前页
      limit: 8, // 每页记录数
      teacherQuery: {} // 查询条件封装对象
    }
  },

  created() { // 当前页面加载时获取数据
    this.fetchData()
  },

  methods: {
    // 获取讲师列表
    fetchData(page = 1) {
      this.page = page
      this.listLoading = true
      teacher.getPageTeacherList(this.page, this.limit, this.teacherQuery)
        .then(response => {
          this.list = response.data.rows
          this.total = response.data.total
        })
        .catch(error => {
          console.log(error)
        })
      this.listLoading = false
    },

    resetData() {
      this.teacherQuery = {}
      this.fetchData()
    },

    removeDataById(id) {
      this.$confirm('此操作将永久删除该讲师, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          teacher.deleteById(id)
            .then(response => {
              console.log(response)
            })
            .catch(error => {
              console.log(error)
            })
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 刷新数据
          this.fetchData()
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
