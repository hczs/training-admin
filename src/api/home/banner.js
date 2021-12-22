import request from '@/utils/request'
const api_name = '/home/banner'

export default {

  // 查询所有轮播图数据
  getBannerList() {
    return request({
      url: `${api_name}/all`,
      method: 'get'
    })
  },

  // 根据id获取轮播图数据
  getBannerById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },

  // 添加轮播图
  addBanner(banner) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: banner
    })
  },

  // 根据id更新轮播图数据
  updateBannerById(id, banner) {
    return request({
      url: `${api_name}/${id}`,
      method: 'post',
      data: banner
    })
  },

  // 删除轮播图
  deleteBanner(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  }

}
