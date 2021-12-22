<template>
  <div class="app-container">

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="bannerList"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>
      <el-table-column label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>

      <el-table-column label="图片" width="300px" align="center">
        <template slot-scope="scope">
          <div class="info">
            <div class="pic">
              <img :src="scope.row.imageUrl" alt="图片加载失败" width="150px">
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="title" label="名称" width="80" />

      <el-table-column prop="linkUrl" label="跳转链接" />

      <el-table-column prop="createTime" label="添加时间" width="160"/>;

      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/home/banner/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>

    </el-table>

  </div>
</template>
<script>
import banner from '@/api/home/banner'
export default {

  data() {
    return {
      bannerList: [], // 轮播图列表
      page: 1,
      limit: 10
    }
  },

  created() {
    this.getBannerList()
  },

  methods: {
    getBannerList() {
      banner.getBannerList()
        .then(response => {
          this.bannerList = response.data.bannerList
        })
    },

    removeDataById(id) {
      // 弹个确认框做操作
      this.$confirm('此操作将永久删除该记录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '返回',
        type: 'warning'
      })
        .then(() => {
          banner.deleteBanner(id)
            .then(response => {
              // 提示成功
              this.$message({
                type: 'success',
                message: '删除成功！'
              })
              // 刷新数据
              this.getBannerList()
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
    }
  }
}
</script>
