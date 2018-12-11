/**
 *
 * @author zhaokaiyuan
 * @create 2018-01-11 9:52
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 一次性获取所有部门的树形结构（用户数据量小的情况）
 */
export function treeDepartment() {
  return request({
    url: '/system/admin/department/tree',
    method: 'get'
  })
}

/**
 * 根据父节点获取子节点列表
 *
 * @param parentId        父id
 * @param departmentName  部门名称
 * @param pageNum
 * @param pageSize
 */
export function listDepartmentByParentId(parentId, departmentName, pageNum, pageSize) {
  const data = {
    parentId,
    departmentName,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/department/listDepartmentByParentId',
    method: 'get',
    params: data
  })
}

/**
 * 添加部门
 *
 * @param departmentName  部门名
 * @param parentId        父部门
 * @param departmentDesc  部门描述
 */
export function addDepartment(departmentName, parentId, departmentDesc) {
  const data = {
    departmentName,
    parentId,
    departmentDesc
  }
  return request({
    url: '/system/admin/department/add',
    method: 'post',
    headers: { 'content-type': 'application/json;charset=utf-8' },
    data: data
  })
}

/**
 * 根据id获取部门信息
 *
 * @param id 部门id
 */
export function getDepartmentById(id) {
  return request({
    url: '/system/admin/department/getById',
    method: 'get',
    params: { id }
  })
}

/**
 * 根据id修改部门信息
 *
 * @param id              部门id
 * @param departmentName  部门名
 * @param parentId        父部门
 * @param departmentDesc  部门描述
 */
export function updateDepartment(id, departmentName, parentId, departmentDesc) {
  const data = {
    id,
    departmentName,
    parentId,
    departmentDesc
  }
  return request({
    url: '/system/admin/department/edit',
    method: 'post',
    headers: { 'content-type': 'application/json;charset=utf-8' },
    data: data
  })
}

/**
 * 根据部门id批量删除部门
 *
 * @param ids 部门id，多个id中间以，隔开
 */
export function removeDepartment(ids) {
  return request({
    url: '/system/admin/department/remove',
    method: 'post',
    data: qs.stringify({ ids })
  })
}
