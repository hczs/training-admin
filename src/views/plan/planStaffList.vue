<template>
  <div class="app-container">
    <!-- 顶部查询表单 -->
    <el-form :inline="true" class="demo-form-inline">

      <el-form-item label="计划名称">
        <el-input v-model="planQuery.name" placeholder="计划名称" />
      </el-form-item>

      <el-form-item label="职工选择">
        <el-select
          v-model="planQuery.staffId"
          filterable
          placeholder="请选择指定职工">
          <el-option
            v-for="staff in staffList"
            :key="staff.id"
            :label="staff.username"
            :value="staff.id"/>
        </el-select>
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

      <el-table-column prop="name" label="计划名称" />

      <el-table-column label="职工名字">
        <template slot-scope="scope">
          <div
            v-for="staff in staffList"
            :key="staff.id">
            <span v-if="staff.id === scope.row.staffId">
              {{ staff.username }}
            </span>
          </div>
        </template>
      </el-table-column>

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

      <el-table-column prop="summary" label="职工总结" />

      <el-table-column prop="score" label="计划总分数" />

      <el-table-column prop="staffScore" label="所得分数" />

      <el-table-column prop="beginTime" label="开始时间" width="160"/>

      <el-table-column prop="endTime" label="结束时间" width="160"/>

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.staffScore == null" type="warning" size="small" icon="el-icon-warning" @click="openUpdateScore(scope.row.id)">未评分，点击评分</el-button>
          <el-button v-else type="success" size="small" icon="el-icon-success" @click="openUpdateScore(scope.row.id, scope.row.staffScore)">已评分，点击修改分数</el-button>
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

    <!-- 评分对话框 -->
    <el-dialog :visible.sync="dialogFormVisible" title="计划评分">
      <el-form :model="planStaff">
        <el-form-item label="分数">
          <el-input v-model="planStaff.staffScore" autocomplete="off"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateScore">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import teacher from '@/api/learning/teacher'
import planStaff from '@/api/plan/planStaff'
import staff from '@/api/ucenter/staff'

export default {

  data() {
    return {
      dialogFormVisible: false, // 评分对话框显示
      listLoading: true, // 是否显示loading信息
      planList: null, // 数据列表
      total: 0, // 总记录数
      page: 1, // 当前页
      limit: 8, // 每页记录数
      planQuery: {}, // 查询条件封装对象
      teacherList: [], // 讲师列表
      staffList: [], // 职工列表
      planStaff: {
        id: '',
        staffScore: ''
      } // 当前操作的planStaff对象
    }
  },

  created() {
    this.fetchData()
    this.initTeacherList()
    this.getStaffList()
  },

  methods: {
    // 获取计划列表
    fetchData(page = 1) {
      this.page = page
      this.listLoading = true
      planStaff.getPagePlanList(this.page, this.limit, this.planQuery)
        .then(response => {
          this.planList = response.data.rows
          this.total = response.data.total
        })
        .catch(error => {
          console.log(error)
        })
      this.listLoading = false
    },

    // 获取职工列表数据
    getStaffList() {
      staff.getAllStaff()
        .then(response => {
          this.staffList = response.data.staffList
        })
    },

    // 初始化讲师列表
    initTeacherList() {
      teacher.getAllTeacher()
        .then(response => {
          this.teacherList = response.data.teacherList
        })
    },

    // 清空数据
    resetData() {
      this.planQuery = {}
      this.fetchData()
    },

    // 更新分数
    openUpdateScore(id, staffScore) {
      this.planStaff.id = id
      if (staffScore != null) {
        this.planStaff.staffScore = staffScore
      } else {
        this.planStaff.staffScore = null
      }
      console.log(this.planStaff)
      // 打开对话框
      this.dialogFormVisible = true
    },

    // 更新分数
    updateScore() {
      planStaff.updateScore(this.planStaff)
        .then(response => {
          console.log(response)
          this.$message({
            type: 'success',
            message: '评分成功！'
          })
          // 刷新数据，关闭对话框
          this.fetchData()
          this.dialogFormVisible = false
        })
    }
  }
}
</script>
