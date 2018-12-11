// import { param2Obj } from '@/utils'

// const userMap = {
//   admin: {
//     roles: ['admin'],
//     token: 'admin',
//     introduction: '我是超级管理员',
//     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//     name: 'admin'
//   },
//   editor: {
//     roles: ['editor'],
//     token: 'editor',
//     introduction: '我是编辑',
//     avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
//     name: 'Normal Editor'
//   }
// }

export default {
  loginByUsername: config => {
    return {
      status: 200,
      message: '',
      data: 'login'
    }
  },
  getUserInfo: config => {
    return {
      status: 200,
      message: '',
      data: {
        roles: ['editor'],
        token: 'editor',
        introduction: '我是编辑',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Normal Editor'
      }
    }
  },
  logout: () => 'success',
  generateRoutes: () => {
    return {
      'status': 200,
      'message': '请求成功！',
      'data': [
        {
          'path': '',
          'component': '',
          'name': '系统管理',
          'meta': { 'icon': 'systemManagement', 'title': '系统管理', 'role': null, 'functionType': 1 },
          'children': [
            {
              'path': 'systemManagement/user/index',
              'component': 'systemManagement/user/index',
              'name': '用户管理',
              'meta': { 'icon': 'user', 'title': '用户管理', 'role': null, 'functionType': 1, 'code': '' },
              'children': [{
                'path': '',
                'component': '',
                'name': '删除',
                'meta': { 'icon': null, 'title': '删除', 'functionType': 2, 'code': 'del' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '添加',
                'meta': { 'icon': null, 'title': '添加', 'functionType': 2, 'code': 'add' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '修改',
                'meta': { 'icon': null, 'title': '修改', 'functionType': 2, 'code': 'edit' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '启用禁用',
                'meta': { 'icon': null, 'title': '启用禁用', 'functionType': 2, 'code': 'on_off' },
                'children': [],
                'hidden': true
              }]
            },
            {
              'path': 'systemManagement/department/index',
              'component': 'systemManagement/department/index',
              'name': '部门管理',
              'meta': { 'icon': 'department', 'title': '部门管理', 'role': null, 'functionType': 1, 'code': '' },
              'children': [{
                'path': '',
                'component': '',
                'name': '删除',
                'meta': { 'icon': null, 'title': '删除', 'functionType': 2, 'code': 'del' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '添加',
                'meta': { 'icon': null, 'title': '添加', 'functionType': 2, 'code': 'add' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '修改',
                'meta': { 'icon': null, 'title': '修改', 'functionType': 2, 'code': 'edit' },
                'children': [],
                'hidden': true
              }]
            },
            {
              'path': 'systemManagement/role/index',
              'component': 'systemManagement/role/index',
              'name': '角色管理',
              'meta': { 'icon': 'role', 'title': '角色管理', 'role': null, 'functionType': 1, 'code': '' },
              'children': [{
                'path': '',
                'component': '',
                'name': '删除',
                'meta': { 'icon': null, 'title': '删除', 'functionType': 2, 'code': 'del' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '添加',
                'meta': { 'icon': null, 'title': '添加', 'functionType': 2, 'code': 'add' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '修改',
                'meta': { 'icon': null, 'title': '修改', 'functionType': 2, 'code': 'edit' },
                'children': [],
                'hidden': true
              }]
            },
            {
              'path': 'systemManagement/group/index',
              'component': 'systemManagement/group/index',
              'name': '群组管理',
              'meta': { 'icon': 'group', 'title': '群组管理', 'role': null, 'functionType': 1, 'code': '' },
              'children': [{
                'path': '',
                'component': '',
                'name': '删除',
                'meta': { 'icon': null, 'title': '删除', 'functionType': 2, 'code': 'del' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '添加',
                'meta': { 'icon': null, 'title': '添加', 'functionType': 2, 'code': 'add' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '修改',
                'meta': { 'icon': null, 'title': '修改', 'functionType': 2, 'code': 'edit' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '查看',
                'meta': { 'icon': null, 'title': '查看', 'functionType': 2, 'code': 'check' },
                'children': [],
                'hidden': true
              }]
            },
            {
              'path': 'systemManagement/group/checkUser',
              'component': 'systemManagement/group/checkUser',
              'name': '群组管理',
              'meta': { 'noTab': true, 'icon': null, 'title': '群组管理', 'functionType': 1, 'code': '' },
              'children': [{
                'path': '',
                'component': '',
                'name': '删除',
                'meta': { 'icon': null, 'title': '删除', 'functionType': 2, 'code': 'del' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '添加',
                'meta': { 'icon': null, 'title': '添加', 'functionType': 2, 'code': 'add' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '保存',
                'meta': { 'icon': null, 'title': '保存', 'functionType': 2, 'code': 'save' },
                'children': [],
                'hidden': true
              }],
              'hidden': true
            },
            {
              'path': 'systemManagement/menu/index',
              'component': 'systemManagement/menu/index',
              'name': '菜单管理',
              'meta': { 'icon': 'menu', 'title': '菜单管理', 'role': null, 'functionType': 1, 'code': '' },
              'children': [{
                'path': '',
                'component': '',
                'name': '删除',
                'meta': { 'icon': null, 'title': '删除', 'functionType': 2, 'code': 'del' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '添加',
                'meta': { 'icon': null, 'title': '添加', 'functionType': 2, 'code': 'add' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '修改',
                'meta': { 'icon': null, 'title': '修改', 'functionType': 2, 'code': 'edit' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '保存',
                'meta': { 'icon': null, 'title': '保存', 'functionType': 2, 'code': 'save' },
                'children': [],
                'hidden': true
              }]
            },
            {
              'path': 'systemManagement/menuAuthor/index',
              'component': 'systemManagement/menuAuthor/index',
              'name': '菜单授权管理',
              'meta': { 'icon': 'menuAuthor', 'title': '菜单授权管理', 'role': null, 'functionType': 1, 'code': '' },
              'children': [{
                'path': '',
                'component': '',
                'name': '删除角色',
                'meta': { 'icon': null, 'title': '删除角色', 'functionType': 2, 'code': 'delRole' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '添加角色',
                'meta': { 'icon': null, 'title': '添加角色', 'functionType': 2, 'code': 'addRole' },
                'children': [],
                'hidden': true
              }, {
                'path': '',
                'component': '',
                'name': '保存',
                'meta': { 'icon': null, 'title': '保存', 'functionType': 2, 'code': 'save' },
                'children': [],
                'hidden': true
              }]
            }
          ]
        },
        {
          'path': '',
          'component': '',
          'name': '文件管理',
          'meta': { 'icon': 'fileManagement', 'title': '文件管理', 'role': null, 'functionType': 1 },
          'children': [
            {
              'path': 'fileManagement/filePermission/index',
              'component': 'fileManagement/filePermission/index',
              'name': '文件权限管理',
              'meta': { 'icon': 'filePermission', 'title': '文件权限管理', 'role': null, 'functionType': 1, 'code': '' },
              'children': [
                {
                  'path': '',
                  'component': '',
                  'name': '删除',
                  'meta': { 'icon': null, 'title': '删除', 'functionType': 2, 'code': 'del' },
                  'children': [],
                  'hidden': true
                },
                {
                  'path': '',
                  'component': '',
                  'name': '添加',
                  'meta': { 'icon': null, 'title': '添加', 'functionType': 2, 'code': 'add' },
                  'children': [],
                  'hidden': true
                },
                {
                  'path': '',
                  'component': '',
                  'name': '修改',
                  'meta': { 'icon': null, 'title': '修改', 'functionType': 2, 'code': 'edit' },
                  'children': [],
                  'hidden': true
                }
              ]
            },
            {
              'path': 'fileManagement/folder/index',
              'component': 'fileManagement/folder/index',
              'name': '文件夹管理',
              'meta': { 'icon': 'folder', 'title': '文件夹管理', 'role': null, 'functionType': 1, 'code': '' },
              'children': [
                {
                  'path': '',
                  'component': '',
                  'name': '保存',
                  'meta': { 'icon': null, 'title': '保存', 'functionType': 2, 'code': 'save' },
                  'children': [],
                  'hidden': true
                },
                {
                  'path': '',
                  'component': '',
                  'name': '添加',
                  'meta': { 'icon': null, 'title': '添加', 'functionType': 2, 'code': 'add' },
                  'children': [],
                  'hidden': true
                },
                {
                  'path': '',
                  'component': '',
                  'name': '修改',
                  'meta': { 'icon': null, 'title': '修改', 'functionType': 2, 'code': 'edit' },
                  'children': [],
                  'hidden': true
                },
                {
                  'path': '',
                  'component': '',
                  'name': '删除',
                  'meta': { 'icon': null, 'title': '删除', 'functionType': 2, 'code': 'del' },
                  'children': [],
                  'hidden': true
                },
                {
                  'path': '',
                  'component': '',
                  'name': '设置',
                  'meta': { 'icon': null, 'title': '设置', 'functionType': 2, 'code': 'set' },
                  'children': [],
                  'hidden': true
                },
                {
                  'path': '',
                  'component': '',
                  'name': '查看',
                  'meta': { 'icon': null, 'title': '查看', 'functionType': 2, 'code': 'check' },
                  'children': [],
                  'hidden': true
                }
              ]
            },
            {
              'path': 'fileManagement/folder/addFolder',
              'component': 'fileManagement/folder/addFolder',
              'name': '添加文件夹',
              'meta': { 'noTab': true, 'icon': '', 'title': '添加文件夹', 'role': null, 'functionType': 1, 'code': '' },
              'children': [
                {
                  'path': '',
                  'component': '',
                  'name': '删除角色',
                  'meta': { 'icon': null, 'title': '删除角色', 'functionType': 2, 'code': 'delRole' },
                  'children': [],
                  'hidden': true
                }, {
                  'path': '',
                  'component': '',
                  'name': '添加角色',
                  'meta': { 'icon': null, 'title': '添加角色', 'functionType': 2, 'code': 'addRole' },
                  'children': [],
                  'hidden': true
                }, {
                  'path': '',
                  'component': '',
                  'name': '删除部门',
                  'meta': { 'icon': null, 'title': '删除部门', 'functionType': 2, 'code': 'delDepartment' },
                  'children': [],
                  'hidden': true
                }, {
                  'path': '',
                  'component': '',
                  'name': '添加部门',
                  'meta': { 'icon': null, 'title': '添加部门', 'functionType': 2, 'code': 'addDepartment' },
                  'children': [],
                  'hidden': true
                }, {
                  'path': '',
                  'component': '',
                  'name': '删除群组',
                  'meta': { 'icon': null, 'title': '删除群组', 'functionType': 2, 'code': 'delGroup' },
                  'children': [],
                  'hidden': true
                }, {
                  'path': '',
                  'component': '',
                  'name': '添加群组',
                  'meta': { 'icon': null, 'title': '添加群组', 'functionType': 2, 'code': 'addGroup' },
                  'children': [],
                  'hidden': true
                }, {
                  'path': '',
                  'component': '',
                  'name': '保存',
                  'meta': { 'icon': null, 'title': '删除', 'functionType': 2, 'code': 'save' },
                  'children': [],
                  'hidden': true
                }
              ],
              'hidden': true
            },
            {
              'path': 'fileManagement/folder/checkPermission',
              'component': 'fileManagement/folder/checkPermission',
              'name': '查看权限',
              'meta': { 'noTab': true, 'icon': '', 'title': '查看权限', 'role': null, 'functionType': 1, 'code': '' },
              'children': [],
              'hidden': true
            },
            {
              'path': 'fileManagement/file/index',
              'component': 'fileManagement/file/index',
              'name': '文件管理',
              'meta': { 'icon': 'file', 'title': '文件管理', 'role': null, 'functionType': 1, 'code': '' },
              'children': [
                {
                  'path': '',
                  'component': '',
                  'name': '删除',
                  'meta': { 'icon': null, 'title': '删除', 'functionType': 2, 'code': 'del' },
                  'children': [],
                  'hidden': true
                },
                {
                  'path': '',
                  'component': '',
                  'name': '添加',
                  'meta': { 'icon': null, 'title': '添加', 'functionType': 2, 'code': 'add' },
                  'children': [],
                  'hidden': true
                },
                {
                  'path': '',
                  'component': '',
                  'name': '修改',
                  'meta': { 'icon': null, 'title': '修改', 'functionType': 2, 'code': 'edit' },
                  'children': [],
                  'hidden': true
                },
                {
                  'path': '',
                  'component': '',
                  'name': '复制',
                  'meta': { 'icon': null, 'title': '复制', 'functionType': 2, 'code': 'copy' },
                  'children': [],
                  'hidden': true
                },
                {
                  'path': '',
                  'component': '',
                  'name': '移动',
                  'meta': { 'icon': null, 'title': '移动', 'functionType': 2, 'code': 'move' },
                  'children': [],
                  'hidden': true
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
