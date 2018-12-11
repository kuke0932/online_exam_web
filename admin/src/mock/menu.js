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

function getRandomArrayElements(arr, count) {
  const shuffled = arr.slice(0)
  const i = arr.length
  const min = i - count
  while (arr.length-- > min) {
    const index = Math.floor((i + 1) * Math.random())
    const temp = shuffled[index]
    shuffled[index] = shuffled[i]
    shuffled[i] = temp
  }
  return shuffled.slice(min)
}
// const roleList = roleApi.roleList
const n = Math.floor(Math.random() * roleList.length)
const itemRoleList = getRandomArrayElements(roleList, n)
const menuTree = []
for (let i = 1; i < 4; i++) {
  menuTree.push(Mock.mock({
    'id|+1': '@increment',
    label: '菜单' + i,
    children: [
      {
        id: '@increment',
        label: '菜单' + i + '-1'
      },
      {
        id: '@increment',
        label: '菜单' + i + '-2'
      }
    ]
  }))
}
const menuList = []
menuTree.forEach(e => toList(e))

function toList(ml) {
  const item = {
    id: ml.id,
    label: ml.label
  }
  menuList.push(item)
  ml.children && ml.children.forEach(e => {
    toList(e)
  })
}

/* const roleLists = []
for (let i = 0; i < 5; i++) {
  roleLists.push(roleList)
} */
const menuInfo = []
for (let i = 0; i < menuList.length; i++) {
  const ids = []
  const menuName = []
  const fatherMenu = []
  menuList.forEach((e, i) => {
    ids.push(e.id)
    menuName.push(e.label)
    fatherMenu.push(e.label)
  })
  menuInfo.push(Mock.mock({
    id: ids[i],
    menuName: menuName[i],
    fatherMenu: fatherMenu[i],
    menuAddr: '@email',
    'menuType|1': [1, 2, 3, 4],
    'menuIcon|1': [1, 2, 3, 4],
    'menuOrder|1': [1, 2, 3, 4]
    // 'roleList|1': roleLists
  }))
}

export default {
  treeFunction: config => {
    return {
      status: 200,
      message: '',
      data: {
        rows: menuTree
      }
    }
  },
  getFunctionById: config => {
    const { id } = param2Obj(config.url)
    const ids = []
    for (let i = 0; i < menuInfo.length; i++) {
      ids.push(menuInfo[i].id)
    }
    const k = ids.indexOf(parseInt(id))
    return {
      status: 200,
      message: '',
      data: {
        menuAddr: menuInfo[k].menuAddr,
        menuType: menuInfo[k].menuType,
        menuIcon: menuInfo[k].menuIcon,
        menuOrder: menuInfo[k].menuOrder
      }
    }
  },
  removeFunction: config => {
    const body = config.body
    const params = body.split('=')
    const idsStr = decodeURIComponent(params[1])
    const ids = idsStr.split(',')
    const idsArr = JSON.parse('[' + String(ids) + ']')
    console.log(menuTree.length)
    for (let i = 0; i < menuTree.length; i++) {
      idsArr.forEach(e => {
        if (e === menuTree[i].id) {
          menuTree.splice(i, 1)
        }
      })
    }
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  addFunction: config => {
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  updateFunction: config => {
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  listRoleByFunctionId: config => {
    const { pageNum, pageSize } = param2Obj(config.url)
    console.log(pageNum, pageSize)
    const list = []
    for (let i = (pageNum - 1) * pageSize, j = 0; i < pageNum * pageSize && i < itemRoleList.length; i++, j++) {
      list[j] = itemRoleList[i]
    }
    return {
      status: 200,
      message: '',
      data: {
        pageNum: pageNum,
        pageSize: pageSize,
        total: itemRoleList.length,
        pages: (itemRoleList.length - 1) / 10 + 1,
        size: list.length,
        rows: list
      }
    }
  },
  addRoleToFunction: config => {
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  removeRoleFromFunction: config => {
    return {
      status: 200,
      message: '',
      data: ''
    }
  },
  menuInfo
}
