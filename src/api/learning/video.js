import request from '@/utils/request'

const api_name = '/learning/video'

export default {

  // 根据id获取小节信息
  getVideoInfoById(videoId) {
    return request({
      url: `${api_name}/${videoId}`,
      method: 'get'
    })
  },

  // 添加小节
  addVideo(video) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: video
    })
  },

  // 更新小节信息
  updateVideo(video) {
    return request({
      url: `${api_name}/update`,
      method: 'post',
      data: video
    })
  },

  // 删除小节
  deleteVideo(videoId) {
    return request({
      url: `${api_name}/${videoId}`,
      method: 'delete'
    })
  }

}
