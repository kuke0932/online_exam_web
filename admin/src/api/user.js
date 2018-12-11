/**
 *
 * @author zhaokaiyuan
 * @create 2018-01-11 9:52
 **/

import request from '@/utils/request'
import qs from 'qs'

/**
 * 添加用户
 *
 * @param loginName     用户名
 * @param loginPwd      密码
 * @param departmentIds 部门id，多个id中间以，隔开
 * @param userName      用户昵称
 * @param mobile        手机号
 * @param telephone     座机号
 * @param email         邮箱
 */
export function addUser(loginName, loginPwd, departmentIds, userName, mobile, telephone, email) {
  const data = {
    loginName,
    loginPwd,
    departmentIds,
    userName,
    mobile,
    telephone,
    email
  }
  return request({
    url: '/system/admin/sysUser/addUser',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据id修改用户信息
 *
 * @param id            用户id
 * @param departmentIds 部门id，多个id中间以，隔开
 * @param userName      用户昵称
 * @param mobile        手机号
 * @param telephone     座机号
 * @param email         邮箱
 */
export function updateUser(id, departmentIds, userName, mobile, telephone, email) {
  const data = {
    id,
    departmentIds,
    userName,
    mobile,
    telephone,
    email
  }
  return request({
    url: '/system/admin/sysUser/updateUser',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 根据id批量删除用户
 *
 * @param ids 用户id，多个id中间以，隔开
 */
export function removeUser(ids) {
  return request({
    url: '/system/admin/sysUser/removeUser',
    method: 'post',
    data: qs.stringify({ ids })
  })
}

/**
 * 根据id获取用户信息
 *
 * @param id 用户id
 */
export function getUserById(id) {
  return request({
    url: '/system/admin/sysUser/getUserById',
    method: 'get',
    params: { id }
  })
}

/**
 * 根据 部门id/用户名/用户昵称 查询用户列表信息
 *
 * @param departmentId  部门id
 * @param loginName     用户名
 * @param userName      用户昵称
 * @param showOrAdd     区分是查看用户还是添加用户（1查看用户列表，2群组添加用户）
 * @param pageNum       当前页
 * @param pageSize      每页显示多少条信息
 */
export function listUser(departmentId, loginName, userName, showOrAdd = 1, pageNum = 1, pageSize = 10) {
  const data = {
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
 * 修改用户状态
 *
 * @param id      用户id
 * @param status  状态(1：正常，0：冻结)
 */
export function updateStatus(id, status) {
  const data = {
    id,
    status
  }
  return request({
    url: '/system/admin/sysUser/updateStatus',
    method: 'post',
    data: qs.stringify(data)
  })
}

/**
 * 重置密码
 *
 * @param id        用户id
 * @param loginPwd 新密码
 */
export function resetPassword(id, loginPwd) {
  const data = {
    id,
    loginPwd
  }
  return request({
    url: '/system/admin/sysUser/resetPassword',
    method: 'post',
    data: qs.stringify(data)
  })
}
