<template>
  <div class="app-container">
    <el-form ref="banner" :model="banner" label-width="100px">
      <div class="app-container">
        <el-form-item label="轮播图图片：" label-width="100px" >
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API+'/oss/file/upload'"
            class="avatar-uploader">
            <img v-if="banner.imageUrl" :src="banner.imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
      </div>
      <el-form-item label="标题:">
        <el-input v-model="banner.title" clearable placeholder="轮播图标题" />
      </el-form-item>

      <el-form-item label="跳转链接">
        <el-input v-model="banner.linkUrl" clearable placeholder="请输入轮播图点击后的跳转链接" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit" >{{ submitButton }}</el-button>
        <el-button @click="back">返回</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>
<script>
import banner from '@/api/home/banner'
export default {
  data() {
    return {
      banner: {},
      submitButton: '立即添加',
      BASE_API: process.env.BASE_API
    }
  },

  watch: {
    // 监听路由变化，解决created只会执行一次，导致没有id也会回显数据的bug
    $route(to, from) {
      // 清空一下，并且添加默认图片
      this.banner = {}
      this.submitButton = '立即添加'
    }
  },

  created() {
    // 只在有id的时候调用回显
    if (this.$route.params && this.$route.params.id) {
      // 从路径获取id值
      const id = this.$route.params.id
      // 修改按钮
      this.submitButton = '立即修改'
      // 调用回显
      this.getById(id)
    } else {
      // 没有id的时候清空
      this.banner = {
        title: '',
        linkUrl: '',
        imageUrl: 'http://hsunnyc.oss-cn-beijing.aliyuncs.com/banner/banner007.jpg'
      }
    }
  },

  methods: {
    // 提交
    onSubmit() {
      // 判断是添加还是修改
      if (this.banner.id != null) {
        // 不为空就是修改
        this.updateById(this.banner.id, this.banner)
      } else {
        // 为空就是添加
        this.addTeacher()
      }
    },

    // 返回
    back() {
      this.$router.go(-1)
    },

    // 添加讲师
    addTeacher() {
      banner.addBanner(this.banner)
        .then(response => {
          // 添加成功提示消息,然后跳转页面
          this.$message({
            message: '添加成功!',
            type: 'success'
          })
          this.$router.push({ path: '/home/banner/list' })
        })
        .catch(error => {
          console.log(error)
        })
    },

    // 修改讲师
    updateById(id) {
      banner.updateBannerById(id, this.banner)
        .then(response => {
          // 修改成功消息，然后跳转页面
          this.$message({
            message: '修改成功！',
            type: 'success'
          })
          this.$router.push({ path: '/home/banner/list' })
        })
        .catch(error => {
          console.log(error)
        })
    },

    // 根据id回显数据
    getById(id) {
      banner.getBannerById(id)
        .then(response => {
          this.banner = response.data.banner
        })
        .catch(error => {
          console.log(error)
        })
    },

    // 成功上传
    handleAvatarSuccess(res) {
      this.banner.imageUrl = res.data.url
    },
    // 校验上传图片的大小是否符合要求（还可以校验格式等等）
    beforeAvatarUpload(file) {
      const isJPGorPng = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M && isJPGorPng
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
    width: 600px;
    height: 300px;
    line-height: 300px;
    text-align: center;
  }
  .avatar {
    width: 600px;
    height: 300px;
    display: block;
  }
</style>
