import request from '@/utils/request'

const api_name = '/learning/teacher'

export default {
  // 分页查询所有讲师
  getPageTeacherList(page, limit, teacherQuery) {
    return request({
      url: `${api_name}/${page}/${limit}`,
      method: 'post',
      data: teacherQuery
    })
  },
  // 获取所有讲师数据
  getAllTeacher() {
    return request({
      url: `${api_name}/all`,
      method: 'get'
    })
  },
  // 根据id删除讲师
  deleteById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'delete'
    })
  },
  // 添加讲师
  addTeacher(teacher) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: teacher
    })
  },
  // 根据id获取讲师信息
  getTeacherById(id) {
    return request({
      url: `${api_name}/${id}`,
      method: 'get'
    })
  },
  // 根据id更新讲师信息
  updateById(id, teacher) {
    return request({
      url: `${api_name}/${id}`,
      method: 'post',
      data: teacher
    })
  }
}
