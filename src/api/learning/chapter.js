import request from '@/utils/request'

const api_name = '/learning/chapter'

export default {

  // 查询课程下的章节和小节数据
  getTreeList(courseId) {
    return request({
      url: `${api_name}/treeList/${courseId}`,
      method: 'get'
    })
  },
  // 根据id获取章节数据
  getChapterById(chapterId) {
    return request({
      url: `${api_name}/${chapterId}`,
      method: 'get'
    })
  },
  // 添加章节数据
  addChapter(chapter) {
    return request({
      url: `${api_name}/add`,
      method: 'post',
      data: chapter
    })
  },
  // 更新章节数据
  updateChapter(chapter) {
    return request({
      url: `${api_name}/update`,
      method: 'post',
      data: chapter
    })
  },
  // 删除章节数据
  deleteChapter(chapterId) {
    return request({
      url: `${api_name}/${chapterId}`,
      method: 'delete'
    })
  }

}
