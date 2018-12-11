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
export function list(name, pageNum = 1, pageSize = 10) {
  const data = {
    name,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/category/list',
    method: 'get',
    params: data
  })
}

/**
 * 添加专题
 * @param name
 * @param sort
 */
export function add(name, sort) {
  const data = {
    name,
    sort
  }
  return request({
    url: '/system/admin/category/add',
    method: 'post',
    headers: { 'content-type': 'application/json;charset=utf-8' },
    data: data
  })
}

/**
 * 根据id获取专题信息
 *
 * @param id 部门id
 */
export function getById(id) {
  return request({
    url: '/system/admin/category/getById',
    method: 'get',
    params: { id }
  })
}

/**
 * 修改专题
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
    url: '/system/admin/category/edit',
    method: 'post',
    headers: { 'content-type': 'application/json;charset=utf-8' },
    data: data
  })
}

/**
 * 根据部门id批量删除专题
 *
 * @param ids 专题id，多个id中间以,隔开
 */
export function remove(ids) {
  return request({
    url: '/system/admin/category/remove',
    method: 'post',
    data: qs.stringify({ ids })
  })
}
