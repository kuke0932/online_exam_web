/**
 *
 * @author Liuchaoqun
 * @create 2018-01-18 17:42
 **/
import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import departmentApi from './department'
const departmentList = departmentApi.departmentList

const groupList = []
const groupJson = {}
const groupUserList = []

for (let i = 0; i < 16; i++) {
  const group = Mock.mock({
    id: '@increment',
    groupName: '@cname',
    groupDesc: '@ctitle(15, 25)',
    groupUser: '@cname' + ' @cname'
  })
  groupList.push(group)
  groupJson[group.id] = group
}

for (let i = 0; i < 12; i++) {
  const d1 = departmentList[Math.floor(Math.random() * departmentList.length)]
  const d2 = departmentList[Math.floor(Math.random() * departmentList.length)]
  const d3 = departmentList[Math.floor(Math.random() * departmentList.length)]
  const d4 = departmentList[Math.floor(Math.random() * departmentList.length)]
  const d5 = departmentList[Math.floor(Math.random() * departmentList.length)]

  const n = Math.floor(Math.random() * 5)
  const user = Mock.mock({
    'id|+1': '@increment',
    loginName: '@cname' + '@cname',
    'departmentIdList': [[d1.id, d3.id], [d2.id], [d5.id], [d4.id, d2.id], [d3.id]][n],
    'departmentNameList': [d1.label + '，' + d3.label, d2.label, d5.label, d4.label + '，' + d2.label, d3.label][n],
    userName: '@cname' + '@cname',
    mobile: /^1[0-9]{10}$/,
    'status|1': [0, 1],
    email: '@email'
  })
  groupUserList.push(user)
}

export default {
  listGroup: config => {
    const { pageNum, pageSize } = param2Obj(config.url)
    const list = []
    for (let i = (pageNum - 1) * pageSize, j = 0; i < pageNum * pageSize && i < groupList.length; i++, j++) {
      list[j] = groupList[i]
    }
    return {
      status: 200,
      message: '',
      data: {
        pageNum: pageNum,
        pageSize: pageSize,
        total: groupList.length,
        pages: (groupList.length - 1) / 10 + 1,
        size: list.length,
        rows: list
      }
    }
  },
  addGroup: config => {
    const body = config.body
    const params = body.split('&')
    const paramJson = {}
    params.forEach(e => {
      paramJson[e.split('=')[0]] = decodeURIComponent(e.split('=')[1])
    })
    groupList.push(paramJson)
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  updateGroup: config => {
    const body = config.body
    const params = body.split('&')
    const paramJson = {}
    params.forEach(e => {
      paramJson[e.split('=')[0]] = decodeURIComponent(e.split('=')[1])
    })
    console.log(paramJson['id'])
    groupJson[paramJson['id']].groupName = paramJson['groupName']
    groupJson[paramJson['id']].groupDesc = paramJson['groupDesc']
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  removeGroup: config => {
    const body = config.body
    console.log(body)
    const params = body.split('=')
    const idsStr = decodeURIComponent(params[1])
    const ids = idsStr.split(',')
    const idsArr = JSON.parse('[' + String(ids) + ']')
    for (let i = 0; i < groupList.length; i++) {
      idsArr.forEach(e => {
        if (e === groupList[i].id) {
          groupList.splice(i, 1)
        }
      })
    }
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  showGroupUsers: config => {
    const { pageNum, pageSize } = param2Obj(config.url)
    const list = []
    for (let i = (pageNum - 1) * pageSize, j = 0; i < pageNum * pageSize && i < groupUserList.length; i++, j++) {
      list[j] = groupUserList[i]
    }
    return {
      status: 200,
      message: '',
      data: {
        pageNum: pageNum,
        pageSize: pageSize,
        total: groupUserList.length,
        pages: (groupUserList.length - 1) / 10 + 1,
        size: list.length,
        rows: list
      }
    }
  },
  removeUserFromGroup: config => {
    const body = config.body
    const params = body.split('=')
    const idsStr = decodeURIComponent(params[1])
    const ids = idsStr.split(',')
    const idsArr = JSON.parse('[' + String(ids) + ']')
    for (let i = 0; i < groupUserList.length; i++) {
      idsArr.forEach(e => {
        if (e === groupUserList[i].id) {
          groupUserList.splice(i, 1)
        }
      })
    }
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  addUserToGroup: config => {
    return {
      status: 200,
      message: '',
      data: ''
    }
  }
}

