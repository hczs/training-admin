<template>
  <div class="app-container">

    <el-form label-width="120px">
      <el-form-item label="模板说明">
        <el-tag type="info">
          模板提供一级分类和二级分类两列，一级分类和其下的二级分类（子类）一一对应填写，更多请参考模板内容格式。
        </el-tag>
        <el-tag>
          <i class="el-icon-download" />
          <a :href="OSS_PATH + '/excel/model.xlsx'">点击下载模板</a>
        </el-tag>
      </el-form-item>

      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="fileUploadSuccess"
          :on-error="fileUploadError"
          :limit="1"
          :action="BASE_API+'/learning/course-category/import'"
          name="file"
          accept="application/vnd.ms-excel" >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button
            :loading="loading"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload">上传到服务器</el-button>
        </el-upload>
      </el-form-item>
    </el-form>

    <el-input v-model="filterText" placeholder="输入关键字进行过滤" style="margin-bottom:30px;" />

    <el-tree
      ref="categoryTree"
      :data="categoryList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      class="filter-tree"
      default-expand-all
    />

  </div>
</template>

<script>
import category from '@/api/learning/category'
export default {

  data() {
    return {
      BASE_API: process.env.BASE_API,
      OSS_PATH: process.env.OSS_PATH,
      loading: false, // 加载动画显示
      filterText: '',
      categoryList: [],
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.categoryTree.filter(val)
    }
  },

  created() {
    this.fetchNodeList()
  },

  methods: {

    // excel导入相关方法
    // 提交上传文件
    submitUpload() {
      this.fileUploadBtnText = '正在上传'
      this.loading = true
      this.$refs.upload.submit()
    },

    // 上传成功回调
    fileUploadSuccess(response) {
      if (response.success === true) {
        this.loading = false
        this.$message({
          type: 'success',
          message: response.message
        })
        // 刷新页面数据
        location.reload()
      }
    },

    // 上传失败回调
    fileUploadError(response) {
      this.loading = false
      this.$message({
        type: 'error',
        message: '导入失败'
      })
    },

    // 课程分类相关方法
    // 回显分类信息
    fetchNodeList() {
      category.getTreeList().then(response => {
        if (response.success === true) {
          this.categoryList = response.data.items
        }
      })
    },
    // 过滤node
    filterNode(value, data) {
      if (!value) {
        // value为空，查询全部
        return true
      } else {
        // 搜索忽略大小写
        var tmpTitle = data.title.toLowerCase()
        return tmpTitle.indexOf(value.toLowerCase()) !== -1
      }
    }
  }
}
</script>
