/**
 *
 * @author Dragon
 * @create 2018-01-15 13:52
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 新增菜单
 *
 * @param functionName  菜单名称
 * @param parentId      父节点
 * @param functionUrl   菜单地址
 * @param functionType  菜单类型1 菜单 2 按钮
 * @param iconStyle     按钮或者菜单上图标样式
 * @param functionCode  按钮code
 * @param functionSort  菜单顺序
 */
export function addFunction(functionName, parentId, functionUrl, functionType, iconStyle, functionCode, functionSort) {
  const data = {
    functionName,
    parentId,
    functionUrl,
    functionType,
    iconStyle,
    functionCode,
    functionSort
  }
  return request({
    url: '/system/admin/sysFunction/addFunction',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据id获取菜单信息
 *
 * @param id
 */
export function getFunctionById(id) {
  return request({
    url: '/system/admin/sysFunction/getFunctionById',
    method: 'get',
    params: {
      id
    }
  })
}

/**
 * 根据id修改菜单
 *
 * @param id            菜单id
 * @param functionName  菜单名称
 * @param parentId      父节点
 * @param functionUrl   菜单地址
 * @param functionType  菜单类型1 菜单 2 按钮
 * @param iconStyle     按钮或者菜单上图标样式
 * @param functionCode  按钮code
 * @param functionSort  菜单顺序
 */
export function updateFunction(id, functionName, parentId, functionUrl, functionType, iconStyle, functionCode, functionSort) {
  const data = {
    id,
    functionName,
    parentId,
    functionUrl,
    functionType,
    iconStyle,
    functionCode,
    functionSort
  }
  return request({
    url: '/system/admin/sysFunction/updateFunction',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据id批量删除菜单
 *
 * @param ids
 */
export function removeFunction(ids) {
  return request({
    url: '/system/admin/sysFunction/removeFunction',
    method: 'post',
    data: qs.stringify({ ids })
  })
}

/**
 * 获取菜单树形结构（菜单授权管理）
 */
export function treeFunction() {
  return request({
    url: '/system/admin/sysFunction/treeFunction',
    method: 'get'
  })
}

/**
 * 根据菜单id获取拥有该菜单的角色
 *
 * @param functionId  菜单id
 * @param roleName    角色名
 * @param roleValue   角色值
 * @param showOrAdd   区分是查看角色还是添加角色（1查看角色列表，2菜单添加角色）
 * @param pageNum     当前页
 * @param pageSize    每页显示多少条数据
 */
export function listRoleByFunctionId(functionId, roleName, roleValue, showOrAdd, pageNum = 1, pageSize = 10) {
  const data = {
    functionId,
    roleName,
    roleValue,
    showOrAdd,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/sysFunction/listRoleByFunctionId',
    method: 'get',
    params: data
  })
}

/**
 * 给菜单添加角色
 *
 * @param functionId  菜单id
 * @param roleIds     角色id，多个id中间以“,”隔开
 */
export function addRoleToFunction(functionId, roleIds) {
  const data = {
    functionId,
    roleIds
  }
  return request({
    url: '/system/admin/sysFunction/addRoleToFunction',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 删除菜单角色
 *
 * @param functionId  菜单id
 * @param roleIds     角色id，多个id中间以“,”隔开
 */
export function removeRoleFromFunction(functionId, roleIds) {
  const data = {
    functionId,
    roleIds
  }
  return request({
    url: '/system/admin/sysFunction/removeRoleFromFunction',
    method: 'post',
    data: qs.stringify(data)
  })
}
