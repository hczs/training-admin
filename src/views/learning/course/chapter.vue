<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" style="margin-bottom: 40px;" process-status="wait" align-center>
      <el-step title="填写课程基本信息" icon="el-icon-edit"/>
      <el-step title="创建课程大纲上传课程视频" icon="el-icon-upload"/>
      <el-step title="确认信息并发布" icon="el-icon-circle-check"/>
    </el-steps>

    <el-form label-width="120px">

      <el-button type="text" @click="dialogChapterFormVisible = true">添加章节</el-button>
      <!-- 章节 -->
      <ul class="chapterList">
        <li
          v-for="chapter in chapterNestedList"
          :key="chapter.id">
          <p>
            {{ chapter.title }}
            <span class="acts">
              <el-button type="text" @click="openVideoDialog(chapter.id)">添加小节</el-button>
              <el-button type="text" @click="fetchChapter(chapter.id)">编辑</el-button>
              <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
            </span>
          </p>

          <!-- 视频 -->
          <ul class="chapterList videoList">
            <li
              v-for="video in chapter.children"
              :key="video.id">
              <p>{{ video.title }}
                <span class="acts">
                  <el-button type="text" @click="fetchVideo(video.id)">编辑</el-button>
                  <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
                </span>
              </p>
            </li>
          </ul>
        </li>
      </ul>
      <div>
        <el-button @click="previous">上一步</el-button>
        <el-button type="primary" @click="next">下一步</el-button>
      </div>
    </el-form>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateChapter">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加和修改小节表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
      <el-form :model="videoForm" label-width="120px">
        <el-form-item label="小节标题">
          <el-input v-model="videoForm.title"/>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/video/vod/upload'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G视频</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button v-loading.fullscreen="fullscreenLoading" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import chapter from '@/api/learning/chapter.js'
import video from '@/api/learning/video.js'
import vod from '@/api/video/vod.js'
export default {
  data() {
    return {
      fullscreenLoading: false, // 加载loading
      courseId: '',
      chapterNestedList: [], // 课程所有的章节列表
      dialogChapterFormVisible: false, // 是否显示章节表单
      chapter: {// 章节对象
        title: ''
      },
      dialogVideoFormVisible: false, // 是否显示小节表单
      videoForm: {
        id: '',
        chapterId: '',
        title: '',
        videoSourceId: '',
        duration: 0,
        size: 0,
        videoOriginalName: ''
      },
      BASE_API: process.env.BASE_API, // 接口API地址
      fileList: []
    }
  },
  watch: {
    // 监听dialogChapterFormVisible发生改变并且是false就清空chapter对象
    dialogChapterFormVisible() {
      if (this.dialogChapterFormVisible === false) {
        // 因为关闭弹窗没必要记录这个对象了，同时也修复了编辑章节数据后再添加章节数据重复显示的bug
        this.chapter = {}
      }
    }
  },

  created() {
    this.init()
  },

  methods: {
    // 初始化页面章节小节信息
    init() {
      if (this.$route.params && this.$route.params.id) {
        this.courseId = this.$route.params.id
        this.getNestedTreeList()
      }
    },
    // 获取章节小节信息
    getNestedTreeList() {
      // 获取课程章节列表信息
      chapter.getTreeList(this.courseId)
        .then(response => {
          this.chapterNestedList = response.data.treeChapter
        })
    },

    // 章节管理相关方法
    // 保存或者更新章节数据
    saveOrUpdateChapter() {
      if (this.chapter.id != null) {
        this.updateChapter()
      } else {
        this.saveChapter()
      }
    },
    // 添加章节
    saveChapter() {
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter)
        .then(response => {
          // 关闭弹框
          this.dialogChapterFormVisible = false
          // 提示成功
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          // 刷新页面
          this.getNestedTreeList()
        })
    },
    // 回显章节数据
    fetchChapter(chapterId) {
      // TODO 修改弹框title
      // 显示弹框
      this.dialogChapterFormVisible = true
      chapter.getChapterById(chapterId)
        .then(response => {
          this.chapter = response.data.chapter
        })
    },
    // 更新章节
    updateChapter() {
      chapter.updateChapter(this.chapter)
        .then(response => {
          // 关闭弹框
          this.dialogChapterFormVisible = false
          // 提示成功
          this.$message({
            type: 'success',
            message: '更新成功!'
          })
          // 刷新页面
          this.getNestedTreeList()
        })
    },
    // 删除章节数据
    removeChapter(chapterId) {
      this.$confirm('此操作将永久删除该记录（包括此章节下的小节记录）, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        return chapter.deleteChapter(chapterId)
      }).then(() => {
        // 删除成功刷新列表
        this.getNestedTreeList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((response) => {
        // 点击取消按钮
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        } else {
          // 删除出现错误，提示错误消息
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },

    // 小节管理相关方法
    // 小节表单弹框控制
    openVideoDialog(id) {
      // 清空信息
      this.videoForm = {}
      this.fileList = []
      // 打开弹框
      this.dialogVideoFormVisible = true
      this.videoForm.chapterId = id
      this.videoForm.courseId = this.courseId
    },
    // 保存或更新小节数据
    saveOrUpdateVideo() {
      if (this.videoForm.id != null) {
        this.updateVideo()
      } else {
        this.saveVideo()
      }
    },
    // 保存小节数据方法
    saveVideo() {
      // 开启loading
      this.fullscreenLoading = true
      // 延时1.5s获取信息（阿里云刚上传上去的视频需要一些时间计算存储才能有时长大小等信息，所以延长时间提交，后台处理信息获取）
      setTimeout(() => {
        // 添加video
        video.addVideo(this.videoForm)
          .then(response => {
            // 关闭弹框
            this.dialogVideoFormVisible = false
            // 提示成功
            this.$message({
              type: 'success',
              message: '小节内容添加成功!'
            })
            // 清空信息
            this.videoForm = {}
            this.fileList = []
            // 刷新页面
            this.getNestedTreeList()
            // 关闭loading
            this.fullscreenLoading = false
          })
          .catch(() => {
            // 关闭loading
            this.fullscreenLoading = false
          })
      }, 1500)
    },
    // 回显小节信息
    fetchVideo(videoId) {
      // 打开弹框
      this.dialogVideoFormVisible = true
      // 回显信息
      video.getVideoInfoById(videoId)
        .then(response => {
          this.videoForm = response.data.video
          // 回显视频名字信息
          this.fileList = [{ 'name': response.data.video.videoOriginalName }]
        })
    },
    // 更新小节数据方法
    updateVideo() {
      video.updateVideo(this.videoForm)
        .then(response => {
          // 关闭弹框
          this.dialogVideoFormVisible = false
          // 提示成功
          this.$message({
            type: 'success',
            message: '更新小节信息成功！'
          })
          // 清空信息
          this.videoForm = {}
          this.fileList = []
          // 刷新页面
          this.getNestedTreeList()
        })
    },
    // 删除小节
    deleteVideo(videoId) {
      // 弹框确认
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定删除
        return video.deleteVideo(videoId)
      }).then(() => {
        this.getNestedTreeList()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch((response) => {
        // 如果是取消
        if (response === 'cancel') {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        } else {
          // 如果是异常
          this.$message({
            type: 'error',
            message: response.message
          })
        }
      })
    },

    // 视频上传相关方法
    // 视频成功上传回调方法
    handleVodUploadSuccess(response, file, fileList) {
      this.videoForm.videoSourceId = response.data.videoSourceId
      this.videoForm.videoOriginalName = file.name
    },
    // 文件个数超过限制时处理方法
    handleUploadExceed(files, fileList) {
      this.$message.warning('上传视频数量超过限制，请删除已上传的再重新上传！')
    },
    // 删除视频处理
    handleVodRemove() {
      vod.deleteVodById(this.videoForm.videoSourceId)
        .then(response => {
          // 清空值
          this.videoForm.videoOriginalName = ''
          this.videoForm.videoSourceId = ''
          this.fileList = []
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
    },

    // 页面控制相关方法
    // 上一步
    previous() {
      this.$router.push({ path: '/learning/course/add/' + this.courseId })
    },
    // 下一步
    next() {
      this.$router.push({ path: '/learning/course/publish/' + this.courseId })
    }
  }
}
</script>

<style scoped>
.chapterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chapterList li{
  position: relative;
}
.chapterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chapterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>
