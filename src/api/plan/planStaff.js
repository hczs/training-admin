import request from '@/utils/request'

const api_name = '/plan/plan-staff'

export default {

  // 分页查询所有职工参与的所有计划，带条件
  getPagePlanList(page, limit, planQuery) {
    return request({
      url: `${api_name}/all/${page}/${limit}`,
      method: 'post',
      data: planQuery
    })
  },

  // 更新分数
  updateScore(planStaff) {
    return request({
      url: `${api_name}/score`,
      method: 'post',
      data: planStaff
    })
  }

}
