import request from '@/utils/request'

const api_name = '/ucenter/staff'

export default {

  // 获取所有职工数据
  getAllStaff() {
    return request({
      url: `${api_name}/all`,
      method: 'get'
    })
  }

}
