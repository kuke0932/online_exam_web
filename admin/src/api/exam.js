import request from '@/utils/request'
import qs from 'qs'

/**
 * 列表
 *
 * @param departmentName  部门名
 * @param examType      考试类型
 * @param publishStatus 考试发布状态
 * @param startDate     考试开始时间
 * @param endDate       考试截至时间
 * @param pageNum
 * @param pageSize
 */
export function list(departmentName, examType, publishStatus, startDate, endDate, pageNum = 1, pageSize = 10) {
  const data = {
    departmentName,
    examType,
    publishStatus,
    startDate,
    endDate,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/exam/list',
    method: 'get',
    params: data
  })
}

/**
 * 添加问题
 * @param examVO
 * departmentId,
 * title,
 * desc,
 * type,
 * publishStatus,
 * singleChoice,
 * multipleChoice,
 * total, scope,
 * startTime,
 * endTime,
 * minutesLength
 */
export function add(examVO) {
  return request({
    url: '/system/admin/exam/add',
    method: 'post',
    headers: { 'content-type': 'application/json;charset=utf-8' },
    data: examVO
  })
}

/**
 * 根据id获取考试信息
 *
 * @param examId 考试id
 */
export function getById(examId) {
  return request({
    url: '/system/admin/exam/getExamById',
    method: 'get',
    params: { examId }
  })
}

/**
 * 根据考试id获取问题列表
 *
 * @param examId        考试id
 * @param categoryName  专题名
 * @param questionName  问题名
 * @param pageNum       当前页
 * @param pageSize      每页显示多少条数据
 */
export function listQuestionsByExamId(examId, categoryName, questionName, pageNum = 1, pageSize = 10) {
  const data = {
    examId,
    categoryName,
    questionName,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/exam/listQuestionsByExamId',
    method: 'get',
    params: data
  })
}

/**
 * 修改考试
 * @param examVO
 * departmentId,
 * title,
 * desc,
 * type,
 * publishStatus,
 * singleChoice,
 * multipleChoice,
 * total, scope,
 * startTime,
 * endTime,
 * minutesLength
 */
export function edit(examVO) {
  return request({
    url: '/system/admin/exam/edit',
    method: 'post',
    headers: { 'content-type': 'application/json;charset=utf-8' },
    data: examVO
  })
}

/**
 * 批量删除问题
 *
 * @param ids 考试id，多个id中间以,隔开
 */
export function remove(ids) {
  return request({
    url: '/system/admin/exam/remove',
    method: 'post',
    data: qs.stringify({ ids })
  })
}

/**
 * 发布考试
 *
 * @param id 考试id
 */
export function publish(id) {
  return request({
    url: '/system/admin/exam/publish',
    method: 'post',
    data: qs.stringify({ id })
  })
}
