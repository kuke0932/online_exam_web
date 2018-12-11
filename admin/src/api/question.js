/**
 *
 * @author zhaokaiyuan
 * @create 2018-01-11 9:52
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 列表
 */
export function list(categoryName, questionName, pageNum = 1, pageSize = 10) {
  const data = {
    categoryName,
    questionName,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/question/list',
    method: 'get',
    params: data
  })
}

/**
 * 添加问题
 * @param name
 * @param sort
 */
export function add(name, sort) {
  const data = {
    name,
    sort
  }
  return request({
    url: '/system/admin/question/add',
    method: 'post',
    headers: { 'content-type': 'application/json;charset=utf-8' },
    data: data
  })
}

/**
 * 根据id获取问题信息
 *
 * @param id 问题id
 */
export function getById(id) {
  return request({
    url: '/system/admin/question/getById',
    method: 'get',
    params: { id }
  })
}

/**
 * 修改问题
 * @param id
 * @param name
 * @param sort
 */
export function edit(id, name, sort) {
  const data = {
    id,
    name,
    sort
  }
  return request({
    url: '/system/admin/question/edit',
    method: 'post',
    headers: { 'content-type': 'application/json;charset=utf-8' },
    data: data
  })
}

/**
 * 批量删除问题
 *
 * @param ids 专题id，多个id中间以,隔开
 */
export function remove(ids) {
  return request({
    url: '/system/admin/question/remove',
    method: 'post',
    data: qs.stringify({ ids })
  })
}
