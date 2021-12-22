import request from '@/utils/request'

const api_name = '/video/vod'

export default {

  // 获取视频详情信息，时长（秒）和 大小（字节）
  getVideoInfo(videoSourceId) {
    return request({
      url: `${api_name}/${videoSourceId}`,
      method: 'get'
    })
  },
  // 删除视频
  deleteVodById(videoSourceId) {
    return request({
      url: `${api_name}/${videoSourceId}`,
      method: 'delete'
    })
  }

}
