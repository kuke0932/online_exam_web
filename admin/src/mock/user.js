/**
 *
 * @author Liuchaoqun
 * @create 2018-01-18 17:42
 **/
import Mock from 'mockjs'
import { param2Obj } from '@/utils'
import departmentApi from './department'

const treeDepartmentJson = departmentApi.treeDepartment().data
const departmentList = departmentApi.departmentList
const userList = []
const userJson = {}

for (let i = 0; i < 35; i++) {
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
  userList.push(user)
  userJson[user.id] = user
}

function queryDepartmentById(tree, id) {
  if (tree['id'] === id) {
    return tree['id']
  } else {
    treeDepartmentJson.children && treeDepartmentJson.children.forEach(e => {
      return queryDepartmentById(tree, id)
    })
  }
}

export default {
  listUser: config => {
    const { pageNum, pageSize } = param2Obj(config.url)
    const list = []
    for (let i = (pageNum - 1) * pageSize, j = 0; i < pageNum * pageSize && i < userList.length; i++, j++) {
      list[j] = userList[i]
    }
    return {
      status: 200,
      message: '',
      data: {
        pageNum: pageNum,
        pageSize: pageSize,
        total: userList.length,
        pages: (userList.length - 1) / 10 + 1,
        size: list.length,
        rows: list
      }
    }
  },
  addUser: config => {
    const body = config.body
    const params = body.split('&')
    const paramJson = {}
    params.forEach(e => {
      paramJson[e.split('=')[0]] = decodeURIComponent(e.split('=')[1])
    })
    console.log(paramJson)
    userList.push(paramJson)
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  updateUser: config => {
    const body = config.body
    const params = body.split('&')
    const paramJson = {}
    params.forEach(e => {
      paramJson[e.split('=')[0]] = decodeURIComponent(e.split('=')[1])
    })
    const departmentIdListArray = []
    userJson[paramJson['id']].userName = paramJson['userName']

    let departmentNames = ''
    paramJson['departmentIds'].split(',').forEach(e => {
      departmentIdListArray.push(e)
      treeDepartmentJson.forEach(td => {
        const d = queryDepartmentById(td, e)
        d && (departmentNames += '，' + d.label)
      })
    })
    userJson[paramJson['id']].departmentIdList = departmentIdListArray
    userJson[paramJson['id']].departmentNameList = departmentNames.substr(1)
    userJson[paramJson['id']].mobile = paramJson['mobile']
    userJson[paramJson['id']].email = paramJson['email']
    userJson[paramJson['id']].userName = paramJson['userName']
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  removeUser: config => {
    const body = config.body
    console.log(body)
    const params = body.split('=')
    const idsStr = decodeURIComponent(params[1])
    const ids = idsStr.split(',')
    const idsArr = JSON.parse('[' + String(ids) + ']')
    for (let i = 0; i < userList.length; i++) {
      idsArr.forEach(e => {
        if (e === userList[i].id) {
          userList.splice(i, 1)
        }
      })
    }
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  getUserById: config => {
    const { id } = param2Obj(config.url)
    return {
      status: 200,
      message: '',
      data: userJson[id]
    }
  },
  updateStatus: config => ({
    status: 200,
    message: '',
    data: {}
  })
}
