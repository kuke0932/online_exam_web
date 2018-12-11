/**
 *
 * @author Liuchaoqun
 * @create 2018-01-18 17:42
 **/
import Mock from 'mockjs'
import { param2Obj } from '@/utils'

const departmentTree = []
for (let i = 1; i < 5; i++) {
  departmentTree.push(Mock.mock({
    id: '@increment',
    label: '部门' + i,
    children: [
      {
        id: '@increment',
        label: '部门' + i + '-1',
        children: [
          {
            id: '@increment',
            label: '部门' + i + '-1-1'
          },
          {
            id: '@increment',
            label: '部门' + i + '-1-2'
          }
        ]
      },
      {
        id: '@increment',
        label: '部门' + i + '-2'
      },
      {
        id: '@increment',
        label: '部门' + i + '-3'
      },
      {
        id: '@increment',
        label: '部门' + i + '-4'
      },
      {
        id: '@increment',
        label: '部门' + i + '-5'
      }
    ]
  }))
}
const departmentList = []
departmentTree.forEach(e => toList(e))

function toList(dt) {
  const d = {
    id: dt.id,
    label: dt.label
  }
  departmentList.push(d)
  dt.children && dt.children.forEach(e => {
    toList(e)
  })
}

export default {
  listDepartmentByParentId: config => {
    // const { parentId } = param2Obj(config.url)
    const { pageNum, pageSize } = param2Obj(config.url)
    const list = []
    for (let i = (pageNum - 1) * pageSize, j = 0; i < pageNum * pageSize && i < departmentList.length; i++, j++) {
      list[j] = departmentList[i]
    }
    return {
      status: 200,
      message: '',
      data: {
        pageNum: pageNum,
        pageSize: pageSize,
        total: departmentList.length,
        pages: (departmentList.length - 1) / 10 + 1,
        size: list.length,
        rows: list
      }
    }
  },
  treeDepartment: config => ({
    status: 200,
    message: '',
    data: departmentTree
  }),
  departmentList,
  addDepartment: config => {
    const body = config.body
    const params = body.split('&')
    const paramJson = {}
    params.forEach(e => {
      paramJson[e.split('=')[0]] = decodeURIComponent(e.split('=')[1])
    })
    departmentList.push(paramJson)
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  updateDepartment: config => {
    const body = config.body
    const params = body.split('&')
    const paramJson = {}
    params.forEach(e => {
      paramJson[e.split('=')[0]] = decodeURIComponent(e.split('=')[1])
    })
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  removeDepartment: config => {
    const body = config.body
    const params = body.split('=')
    const idsStr = decodeURIComponent(params[1])
    const ids = idsStr.split(',')
    const idsArr = JSON.parse('[' + String(ids) + ']')
    for (let i = 0; i < departmentList.length; i++) {
      idsArr.forEach(e => {
        if (e === departmentList[i].id) {
          departmentList.splice(i, 1)
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
