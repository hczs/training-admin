import request from '@/utils/request'

const api_name = '/plan'

export default {

  // 分页查询所有计划
  getPagePlanList(page, limit, planQuery) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'post',
      data: planQuery
    })
  },

  // 根据id回显信息
  getPlanInfo(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },

  // 添加计划信息（发布）
  addPlan(plan) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: plan
    })
  },

  // 更新计划信息（发布）
  updateAddPlan(plan, id) {
    return request({
      url: `${api_name}/add/${id}`,
      method: 'post',
      data: plan
    })
  },

  // 暂存计划
  savePlan(plan) {
    return request({
      url: `${api_name}/save`,
      method: 'post',
      data: plan
    })
  },

  // 更新暂存计划
  updateSavePlan(plan, id) {
    return request({
      url: `${api_name}/save/${id}`,
      method: 'post',
      data: plan
    })
  },

  // 删除课程
  deletePlanById(planId) {
    return request({
      url: `${api_name}/${planId}`,
      method: 'delete'
    })
  }

}
