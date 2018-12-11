/**
 *
 * @author zhaokaiyuan
 * @create 2018-01-11 9:52
 **/
import request from '@/utils/request'
import qs from 'qs'

/**
 * 根据 角色名/角色值 获取角色列表信息list
 *
 * @param roleName  角色名
 * @param roleValue 角色值
 * @param pageNum   当前页
 * @param pageSize  每页显示多少条数据
 */
export function listRole(roleName, roleValue, pageNum = 1, pageSize = 10) {
  const data = {
    roleName,
    roleValue,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/role/listRole',
    method: 'get',
    params: data
  })
}

/**
 * 新增角色
 *
 * @param roleName  角色名
 * @param roleValue 角色值
 * @param roleDesc  角色描述
 */
export function addRole(id, roleName, roleValue, roleDesc) {
  const data = {
    id,
    roleName,
    roleValue,
    roleDesc
  }
  return request({
    url: '/system/admin/role/addRole',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据id获取角色信息
 *
 * @param id 角色id
 */
export function getRoleById(id) {
  return request({
    url: '/system/admin/role/getRoleById',
    method: 'get',
    params: { id }
  })
}

/**
 * 根据id修改角色
 *
 * @param id        角色id
 * @param roleName  角色名
 * @param roleValue 角色值
 * @param roleDesc  角色描述
 */
export function updateRole(id, roleName, roleValue, roleDesc) {
  const data = {
    id,
    roleName,
    roleValue,
    roleDesc
  }
  return request({
    url: '/system/admin/role/updateRole',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据id批量删除角色
 *
 * @param ids 角色id，多个id中间以，隔开
 */
export function removeRole(ids) {
  const data = {
    ids
  }
  return request({
    url: '/system/admin/role/removeRole',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据角色id获取拥有该角色的用户列表
 *
 * @param roleId   角色id
 * @param loginName 用户名
 * @param userName  昵称
 * @param pageNum   当前页
 * @param pageSize  每页显示多少条数据
 */
export function showRoleUsers(roleId, loginName, userName, pageNum = 1, pageSize = 10) {
  const data = {
    roleId,
    loginName,
    userName,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/role/showRoleUsers',
    method: 'get',
    params: data
  })
}

/**
 * 根据 部门id/用户名/用户昵称 查询用户列表信息
 *
 * @param roleId       角色id
 * @param departmentId  部门id
 * @param loginName     用户名
 * @param userName      用户昵称
 * @param showOrAdd     区分是查看用户还是添加用户（1查看用户列表，2群组添加用户，3角色添加用户）
 * @param pageNum       当前页
 * @param pageSize      每页显示多少条信息
 */
export function listUser(roleId, departmentId, loginName, userName, showOrAdd = 3, pageNum = 1, pageSize = 10) {
  const data = {
    roleId,
    departmentId,
    loginName,
    userName,
    showOrAdd,
    pageNum,
    pageSize
  }
  return request({
    url: '/system/admin/sysUser/listUser',
    method: 'get',
    params: data
  })
}

/**
 * 添加用户到角色
 *
 * @param roleId
 * @param userIds
 */
export function addUserToRole(roleId, userIds) {
  const data = {
    roleId,
    userIds
  }
  return request({
    url: '/system/admin/role/addUserToRole',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 从角色里删除用户
 *
 * @param roleId
 * @param userIds
 */
export function removeUserFromRole(roleId, userIds) {
  const data = {
    roleId,
    userIds
  }
  return request({
    url: '/system/admin/role/removeUserFromRole',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 获取角色所拥有的菜单权限
 *
 * @param roleId 角色id
 */
export function getRoleFunction(roleId) {
  const data = {
    roleId
  }
  return request({
    url: '/system/admin/role/getRoleFunction',
    method: 'get',
    params: data
  })
}

/**
 * 给角色设置菜单权限
 *
 * @param roleId      角色id
 * @param functionIds 菜单id集合
 */
export function setFunctionToRole(roleId, functionIds) {
  const data = {
    roleId,
    functionIds
  }
  return request({
    url: '/system/admin/role/setFunctionToRole',
    method: 'post',
    data: qs.stringify(data)
  })
}
