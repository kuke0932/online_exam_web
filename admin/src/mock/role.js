/**
 *
 * @author Liuchaoqun
 * @create 2018-01-18 17:42
 **/
import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const roleList = []
const roleJson = {}
for (let i = 0; i < 16; i++) {
  const role = Mock.mock({
    id: '@increment',
    roleName: '@cname',
    'roleValue|1': ['1', '2', '3', '4', '5'],
    roleDesc: '@ctitle(15, 25)'
  })
  roleList.push(role)
  roleJson[role.id] = role
}

export default {
  listRole: config => {
    const { pageNum, pageSize } = param2Obj(config.url)
    console.log(pageNum, pageSize)
    const list = []
    for (let i = (pageNum - 1) * pageSize, j = 0; i < pageNum * pageSize && i < roleList.length; i++, j++) {
      list[j] = roleList[i]
    }
    return {
      status: 200,
      message: '',
      data: {
        pageNum: pageNum,
        pageSize: pageSize,
        total: roleList.length,
        pages: (roleList.length - 1) / 10 + 1,
        size: list.length,
        rows: list
      }
    }
  },
  getRoleById: config => {
    const { id } = param2Obj(config.url)
    return {
      status: 200,
      message: '',
      data: roleJson[id]
    }
  },
  addRole: config => {
    const body = config.body
    const params = body.split('&')
    const paramJson = {}
    params.forEach(e => {
      paramJson[e.split('=')[0]] = decodeURIComponent(e.split('=')[1])
    })
    roleList.push(paramJson)
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  updateRole: config => {
    const body = config.body
    const params = body.split('&')
    const paramJson = {}
    params.forEach(e => {
      paramJson[e.split('=')[0]] = decodeURIComponent(e.split('=')[1])
    })
    roleJson[paramJson['id']].roleName = paramJson['roleName']
    roleJson[paramJson['id']].roleValue = paramJson['roleValue']
    roleJson[paramJson['id']].roleDesc = paramJson['roleDesc']
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  removeRole: config => {
    const body = config.body
    const params = body.split('=')
    const idsStr = decodeURIComponent(params[1])
    const ids = idsStr.split(',')
    const idsArr = JSON.parse('[' + String(ids) + ']')
    for (let i = 0; i < roleList.length; i++) {
      idsArr.forEach(e => {
        if (e === roleList[i].id) {
          roleList.splice(i, 1)
        }
      })
    }
    return {
      status: 200,
      message: '',
      data: ''
    }
  }
}
