import request from '@/utils/request'

const api_name = '/learning/course'

export default {

  // 根据id获取课程信息
  getCourseInfo(courseId) {
    return request({
      url: `${api_name}/${courseId}`,
      method: 'get'
    })
  },

  // 获取所有课程数据
  getAllCourse() {
    return request({
      url: `${api_name}/all`,
      method: 'get'
    })
  },

  // 分页查询课程列表
  getPageList(page, limit, courseQuery) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'post',
      data: courseQuery
    })
  },

  // 根据id查询课程发布信息
  getCoursePublishInfo(courseId) {
    return request({
      url: `${api_name}/publish/info/${courseId}`,
      method: 'get'
    })
  },

  // 添加课程
  addCourse(course) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: course
    })
  },

  // 发布课程
  publishCourse(courseId) {
    return request({
      url: `${api_name}/publish/${courseId}`,
      method: 'get'
    })
  },

  // 暂存课程
  savePublishCourse(courseId) {
    return request({
      url: `${api_name}/publish/save/${courseId}`,
      method: 'get'
    })
  },

  // 更新课程基本信息
  updateCourse(course) {
    return request({
      url: `${api_name}/update`,
      method: 'post',
      data: course
    })
  },

  // 删除课程
  deleteCourseById(courseId) {
    return request({
      url: `${api_name}/${courseId}`,
      method: 'delete'
    })
  }

}
