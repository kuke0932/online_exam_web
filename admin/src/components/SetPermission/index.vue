<template>
  <div class="container">
    <el-tabs v-model="activeName" style="width: 100%" @tab-click="handleClick">
      <el-tab-pane label="角色" name="first">
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="70px" label="角色名">
                <el-input style='min-width:120px;' v-model="searchRoleName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label-width="80px" label="角色值">
                <el-input style='min-width:120px;' v-model="searchUnRoleValue"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button style="margin-left: 20px;" type="primary" @click="searchRole">查询</el-button>
            </el-col>
          </el-row>
          <div class="btn_box" style="margin-top: 15px;">
            <el-button class="el-button--primary" code="addRole" @click="goAddRole">添加角色</el-button>
            <el-dialog
              title="添加角色"
              :visible.sync="roleDialog"
              width="60%"
              append-to-body
              :before-close="handleClose">
              <el-button class="el-button--primary" style="margin:0 15px 15px; " @click="addRole">保存</el-button>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="70px" label="角色名">
                    <el-input style='min-width:120px;' v-model="searchUnRoleName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="9">
                  <el-form-item label-width="80px" label="角色值">
                    <el-input style='min-width:120px;' v-model="searchUnRoleValue"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3">
                  <el-button style="margin-left: 20px;" type="primary" @click="searchUnRole" :loading="listUnRoleLoading">查询</el-button>
                </el-col>
              </el-row>
              <el-table
                :data="unHadRoleData"
                v-loading.body="listUnRoleLoading"
                element-loading-text="拼命加载中"
                border
                fit
                tooltip-effect="dark"
                highlight-current-row
                @selection-change="handleUnRoleSelection"
                style="width: 100%;margin-top: 20px;">
                <el-table-column type="selection" width="50">
                </el-table-column>
                <el-table-column label="角色名" width="180">
                  <template slot-scope="scope">
                    {{scope.row.roleName}}
                  </template>
                </el-table-column>
                <el-table-column label="角色值" width="180">
                  <template slot-scope="scope">
                    {{scope.row.roleValue}}
                  </template>
                </el-table-column>
                <el-table-column label="角色描述">
                  <template slot-scope="scope">
                    {{scope.row.roleDesc}}
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                style="display: flex;  justify-content: flex-end;"
                background
                layout="prev, pager, next"
                :total="unRoleTotal"
                @current-change="unRoleCurrentPageChange">
              </el-pagination>
            </el-dialog>
            <el-button class="el-button--danger" code="delRole" @click="deleteRole">删除角色</el-button>
          </div>
          <el-table
            :data="roleData"
            border
            ref="role"
            fit
            tooltip-effect="dark"
            highlight-current-row
            @selection-change="handleRoleSelection"
            style="width: 100%;margin-top: 20px;">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column label="角色名" width="180">
              <template slot-scope="scope">
                {{scope.row.roleName}}
              </template>
            </el-table-column>
            <el-table-column label="角色值" width="180">
              <template slot-scope="scope">
                {{scope.row.roleValue}}
              </template>
            </el-table-column>
            <el-table-column label="角色描述">
              <template slot-scope="scope">
                {{scope.row.roleDesc}}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="setFilePermission('role', scope.row.id)">设置文件权限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="部门" name="second">
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="70px" label="部门名">
                <el-input style='min-width:120px;'></el-input>
              </el-form-item>
            </el-col>
            <!--<el-col :span="9">
              <el-form-item label-width="80px" label="父部门">
                <el-input style='min-width:120px;'></el-input>
              </el-form-item>
            </el-col>-->
            <el-col :span="3">
              <el-button style="margin-left: 20px;" type="primary">查询</el-button>
            </el-col>
          </el-row>
          <div class="btn_box" style="margin-top: 15px;">
            <el-button class="el-button--primary" code="addDepartment" @click="goAddDepartment">添加部门</el-button>
            <el-dialog
              title="添加部门"
              :visible.sync="departmentDialog"
              width="60%"
              append-to-body
              :before-close="handleClose">
              <el-button class="el-button--primary" style="margin:0 15px 15px; " @click="addDepartment">保存</el-button>
              <el-tree
                :data="treeDepartment"
                ref="treeDepartment"
                highlight-current
                show-checkbox
                default-expand-all
                check-strictly
                node-key="id"
                :props="defaultProps"
                :expand-on-click-node='false'
                style="padding:0 50px;">
              </el-tree>
            </el-dialog>
            <el-button class="el-button--danger" code="delDepartment" @click="deleteDepartment">删除部门</el-button>
          </div>
          <el-table
            :data="departmentData"
            border
            ref="department"
            fit
            tooltip-effect="dark"
            highlight-current-row
            @selection-change="handleDepartmentSelection"
            style="width: 100%;margin-top: 20px;">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column label="部门名">
              <template slot-scope="scope">
                {{scope.row.departmentName}}
              </template>
            </el-table-column>
            <!--<el-table-column prop="fatherDepartment" label="父部门" width="180">
            </el-table-column>
            <el-table-column prop="departmentDes" label="部门描述">
            </el-table-column>-->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="setFilePermission('department', scope.row.id)">设置文件权限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="群组" name="third">
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="70px" label="群组名">
                <el-input style='min-width:200px;'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3"  style="margin-left: 20px;">
              <el-button type="primary">查询</el-button>
            </el-col>
          </el-row>
          <div class="btn_box" style="margin-top: 15px;">
            <el-button class="el-button--primary" code="addGroup" @click="goAddGroup">添加群组</el-button>
            <el-dialog
              title="添加群组"
              :visible.sync="groupDialog"
              width="60%"
              append-to-body
              :before-close="handleClose">
              <el-button class="el-button--primary" style="margin:0 15px 15px; " @click="addGroup">保存</el-button>
              <el-row>
                <el-col :span="8">
                  <el-form-item label-width="70px" label="群组名">
                    <el-input style='min-width:200px;' v-model="searchGroupName"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" style="margin-left: 50px">
                  <el-button type="primary" @click="searchUnGroup">查询</el-button>
                </el-col>
              </el-row>
              <el-table
                :data="unHadGroupData"
                v-loading.body="listUnGroupLoading"
                element-loading-text="拼命加载中"
                border
                fit
                tooltip-effect="dark"
                highlight-current-row
                @selection-change="handleUnGroupSelection"
                style="width: 100%;margin-top: 20px;">
                <el-table-column type="selection" width="50">
                </el-table-column>
                <el-table-column label="群组名称" width="180">
                  <template slot-scope="scope">
                    {{scope.row.groupName}}
                  </template>
                </el-table-column>
                <el-table-column label="群组描述" width="180">
                  <template slot-scope="scope">
                    {{scope.row.groupDesc}}
                  </template>
                </el-table-column>
                <el-table-column label="群组用户">
                  <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="showUser(scope.row.id)">查看用户</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                style="display: flex;  justify-content: flex-end;"
                background
                layout="prev, pager, next"
                :total="unGroupTotal"
                @current-change="unGroupCurrentPageChange">
              </el-pagination>
            </el-dialog>
            <el-button class="el-button--danger" code="delGroup" @click="deleteGroup">删除群组</el-button>
          </div>
          <el-table
            :data="groupData"
            border
            ref="group"
            fit
            tooltip-effect="dark"
            highlight-current-row
            @selection-change="handleGroupSelection"
            style="width: 100%;margin-top: 20px;">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column label="群组名称" width="180">
              <template slot-scope="scope">
                {{scope.row.groupName}}
              </template>
            </el-table-column>
            <el-table-column label="群组描述" width="180">
              <template slot-scope="scope">
                {{scope.row.groupDesc}}
              </template>
            </el-table-column>
            <el-table-column label="群组用户">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="showUser(scope.row.id)">查看用户</el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template slot-scope="scope">
                <el-button type="primary" size="small" @click="setFilePermission('group', scope.row.id)">设置文件权限</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-button type="primary" @click="submit()">保存</el-button>
    <el-dialog
      title="选择权限"
      :visible.sync="permissionDialog"
      width="40%"
      append-to-body
      :before-close="handleClose">
      <el-tree
        :data="treePermission"
        ref="treePermission"
        highlight-current
        show-checkbox
        node-key="id"
        :props="defaultProps"
        :expand-on-click-node='false'
        style="padding:0 50px;">
      </el-tree>
      <div style="margin:15px 0;text-align: center" >
        <el-button class="el-button--primary" size="small " @click="addSelectPermission" >保存</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="查看用户"
      :visible.sync="showUsersDialog"
      width="60%"
      append-to-body
      :before-close="handleClose">
      <el-table
        :data="groupUsersData"
        v-loading.body="listGroupUsersLoading"
        element-loading-text="拼命加载中"
        border
        fit
        tooltip-effect="dark"
        highlight-current-row
        style="width: 100%;margin-top: 20px;">
        <el-table-column label="用户名称" width="180">
          <template slot-scope="scope">
            {{scope.row.userName}}
          </template>
        </el-table-column>
        <el-table-column label="用户手机号" width="180">
          <template slot-scope="scope">
            {{scope.row.mobile}}
          </template>
        </el-table-column>
        <el-table-column label="用户部门">
          <template slot-scope="scope">
            {{scope.row.departmentName}}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="display: flex;  justify-content: flex-end;"
        background
        layout="prev, pager, next"
        :total="groupUsersTotal"
        @current-change="groupUsersCurrentPageChange">
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
  import { listAddRole as listAddRole_folder, listAddGroup as listAddGroup_folder, setFolderPermission,
    showAllFolderRole, showAllFolderDepartment, showAllFolderGroup } from '@/api/folder'
  import { listAddRole as listAddRole_file, listAddGroup as listAddGroup_file, setFilePermission,
    showAllFolderRole, showAllFolderDepartment, showAllFolderGroup } from '@/api/file'
  import { treeDepartment } from '@/api/department'
  import { showGroupUsers } from '@/api/group'
  import { treeFilePermission } from '@/api/filePermission'
  let listAddRole, listAddGroup, setPermission, showAllRole, showAllDepartment, showAllGroup



  export default {
    name: 'setPermission',
    props: {
      fileId: {
        type: Number,
        required: true
      },
      type: {
        type: String,
        required: true,
        default: 'file'
      }
    },
    data() {
      return {
        unRoleTotal: -1,
        unGroupTotal: -1,
        groupUsersTotal: -1,
        unRolePageNum: 1,
        unRolePageSize: 10,
        unGroupPageNum: 1,
        unGroupPageSize: 10,
        groupUsersPageNum: 1,
        groupUsersPageSize: 10,
        activeName: 'first',
        listUnRoleLoading: false,
        listUnDepartmentLoading: false,
        listUnGroupLoading: false,
        listRoleLoading: false,
        listDepartmentLoading: false,
        listGroupLoading: false,
        listGroupUsersLoading: false,
        searchUnRoleName: null,
        searchUnRoleValue: null,
        searchRoleName: null,
        searchRoleValue: null,
        searchDepartmentName: null,
        searchParentName: null,
        searchGroupName: null,
        treeDepartmentVisible: false,
        roleDialog: false,
        departmentDialog: false,
        groupDialog: false,
        permissionDialog: false,
        showUsersDialog: false,
        groupId: null,
        roleSelections: [],
        departmentSelections: [],
        groupSelections: [],
        unRoleSelections: [],
        unDepartmentSelections: [],
        unGroupSelections: [],
        treePermission: [],
        treeDepartment: [],
        checkedPermission: {
          id: null,
          permissionType: null,
          role: {},
          department: {},
          group: {}
        },
        roleData: [],
        departmentData: [],
        groupData: [],
        groupUsersData: [],
        unHadRoleData: [],
        unHadGroupData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    created() {
      if(this.type === 'file') {

        listAddRole = listAddRole_folder
        listAddGroup = listAddGroup_folder
        setPermission = setFolderPermission
        showAllRole = showAllFolderRole
        showAllDepartment = showAllFolderDepartment
        showAllGroup = showAllFolderGroup
      } else if(this.type === 'folder') {
        listAddRole = listAddRole_folder
        listAddGroup = listAddGroup_folder
        setPermission = setFolderPermission
        showAllRole = showAllFolderRole
        showAllDepartment = showAllFolderDepartment
        showAllGroup = showAllFolderGroup

      }
    },
    mounted() {
      treeFilePermission().then(resp => {
        this.treePermission = resp.data.data
      })
      treeDepartment().then(resp => {
        this.treeDepartment = resp.data.data
      })
    },
    updated() {
      this.$refs['role'].doLayout()
      this.$refs['department'].doLayout()
      this.$refs['group'].doLayout()
    },
    methods: {
      /* 获取未添加的角色列表 */
      fetchUnHadRoleData(roleName, roleValue, pageNum, pageSize) {
        this.listUnRoleLoading = true
        const roleIds = []
        if (this.roleData.length !== 0) {
          this.roleData.forEach((v, i) => {
            roleIds.push(v.id)
          })
        }
        listAddRole(roleIds, roleName, roleValue, pageNum, pageSize).then(response => {
          this.unHadRoleData = response.data.data.rows
          this.unRoleTotal = response.data.data.total
          this.unRolePageNum = response.data.data.pageNum
          this.unRolePageSize = response.data.data.pageSize
          this.listUnRoleLoading = false
        })
      },
      /* 获取选中的角色 */
      handleRoleSelection(val) {
        this.roleSelections = val
      },
      /* 获取选中的部门 */
      handleDepartmentSelection(val) {
        this.departmentSelections = val
      },
      /* 获取选中的群组 */
      handleGroupSelection(val) {
        this.groupSelections = val
      },

      /* 获取未添加的群组列表 */
      fetchUnHadGroupData(groupName, pageNum, pageSize) {
        this.listUnGroupLoading = true
        const groupIds = []
        if (this.groupData.length !== 0) {
          this.groupData.forEach((v, i) => {
            groupIds.push(v.id)
          })
        }
        listAddGroup(groupName, groupIds, pageNum, pageSize).then(response => {
          this.unHadGroupData = response.data.data.rows
          this.unGroupTotal = response.data.data.total
          this.unGroupPageNum = response.data.data.pageNum
          this.unGroupPageSize = response.data.data.pageSize
          this.listUnGroupLoading = false
        })
      },
      /* 获取所有数据 */
      fetchData() {
        this.fetchRoleData(this.fileId, null, null)
        this.fetchDepartmentData(this.fileId, null, null)
        this.fetchGroupData(this.fileId, null)
      },

      /* 获取角色列表 */
      fetchRoleData(folderId, roleName, roleValue) {
        this.listRoleLoading = true
        showAllFolderRole(folderId, roleName, roleValue).then(response => {
          this.roleData = response.data.data
          this.roleData.forEach(v => {
            const pIds = []
            let data
            const permissionId = v.permissionIds.split(',')
            if (permissionId) {
              permissionId.forEach(pId => {
                data = { id: parseInt(pId) }
                pIds.push(data)
              })
            }
            this.checkedPermission.role[v.id] = pIds
          })
          this.listRoleLoading = false
        })
      },
      /* 获取部门列表 */
      fetchDepartmentData(folderId, departmentName, parentName) {
        this.listDepartmentLoading = true
        showAllFolderDepartment(folderId, departmentName, parentName).then(response => {
          this.departmentData = response.data.data
          this.departmentData.forEach(v => {
            const pIds = []
            let data
            const permissionId = v.permissionIds.split(',')
            if (permissionId) {
              permissionId.forEach(pId => {
                data = { id: parseInt(pId) }
                pIds.push(data)
              })
            }
            this.checkedPermission.department[v.id] = pIds
          })
          this.listDepartmentLoading = false
        })
      },
      /* 获取群组列表 */
      fetchGroupData(folderId, groupName) {
        this.listGroupLoading = true
        showAllFolderGroup(folderId, groupName).then(response => {
          this.groupData = response.data.data
          this.groupData.forEach(v => {
            const pIds = []
            let data
            const permissionId = v.permissionIds.split(',')
            if (permissionId) {
              permissionId.forEach(pId => {
                data = { id: parseInt(pId) }
                pIds.push(data)
              })
            }
            this.checkedPermission.group[v.id] = pIds
          })
          this.listGroupLoading = false
        })
      },
      handleClick(tab, event) {

      },
      /* 根据id从数组中移除数据 */
      removeById(val, id) {
        for (let i = 0; i < val.length; i++) {
          if (val[i].id === id) {
            val.splice(i, 1)
            break
          }
        }
      },
      /* =======================添加角色开始================================ */
      /* 打开添加角色窗口 */
      goAddRole() {
        this.fetchUnHadRoleData(null, null, this.unRolePageNum, this.unRolePageSize)
        this.roleDialog = true
      },
      /* 查询未添加的角色列表 */
      searchUnRole() {
        this.fetchUnHadRoleData(this.searchUnRoleName, this.searchUnRoleValue, this.unRolePageNum, this.unRolePageSize)
      },
      searchRole() {
        this.fetchRoleData(
          this.fileId,
          this.searchRoleName,
          this.searchRoleValue
        )
      },
      /* 添加角色保存按钮 */
      addRole() {
        this.unRoleSelections.forEach(v => {
          this.roleData.push(v)
        })
        this.unRoleSelections = []
        this.roleDialog = false
      },
      /* 获取所勾选的角色 */
      handleUnRoleSelection(val) {
        this.unRoleSelections = val
      },
      /* 删除角色 */
      deleteRole() {
        if (this.roleSelections.length === 0) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作!'
          })
          return
        }
        this.roleSelections.forEach(v => {
          this.removeById(this.roleData, v.id)
        })
      },
      /* =======================添加角色结束================================ */
      /* =======================添加部门开始================================ */
      /* 打开添加部门窗口 */
      goAddDepartment() {
        const ids = []
        this.departmentData.forEach(v => {
          ids.push(v.id)
        })
        setTimeout(() => {
          this.$refs['treeDepartment'].setCheckedKeys(ids)
        }, 0)
        this.departmentDialog = true
      },
      searchDepartment() {
        this.fetchDepartmentData(
          this.fileId,
          this.searchDepartmentName,
          this.searchParentName
        )
      },
      /* 添加部门保存按钮 */
      addDepartment() {
        const nodes = this.$refs['treeDepartment'].getCheckedNodes()
        nodes.forEach(v => {
          this.unDepartmentSelections.push({
            id: v.id,
            departmentName: v.label
          })
        })
        this.departmentData = this.unDepartmentSelections
        this.unDepartmentSelections = []
        this.departmentDialog = false
        this.$refs['treeDepartment'].setCheckedKeys([])
      },
      /* 删除部门 */
      deleteDepartment() {
        if (this.departmentSelections.length === 0) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作!'
          })
          return
        }
        this.departmentSelections.forEach(v => {
          this.removeById(this.departmentData, v.id)
        })
      },
      /* =======================添加部门结束================================ */
      /* =======================添加群组开始================================ */
      /* 打开添加群组窗口 */
      goAddGroup() {
        this.fetchUnHadGroupData(null, this.unGroupPageNum, this.unGroupPageSize)
        this.groupDialog = true
      },
      /* 查询未添加的群组列表 */
      searchUnGroup() {
        this.fetchUnHadGroupData(this.searchGroupName, this.unGroupPageNum, this.unGroupPageSize)
      },
      searchGroup() {
        this.fetchGroupData(
          this.fileId,
          this.searchGroupName
        )
      },
      /* 添加群组保存按钮 */
      addGroup() {
        this.unGroupSelections.forEach(v => {
          this.groupData.push(v)
        })
        this.unGroupSelections = []
        this.groupDialog = false
      },
      /* 获取所勾选的群组 */
      handleUnGroupSelection(val) {
        this.unGroupSelections = val
      },
      /* 删除群组 */
      deleteGroup() {
        if (this.groupSelections.length === 0) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作!'
          })
          return
        }
        this.groupSelections.forEach(v => {
          this.removeById(this.groupData, v.id)
        })
      },
      /* 获取群组用户信息 */
      fetchGroupUsers(loginName, userName, pageNum, pageSize) {
        this.listGroupUsersLoading = true
        showGroupUsers(this.groupId, loginName, userName, pageNum, pageSize).then(resp => {
          this.groupUsersData = resp.data.data.rows
          this.groupUsersTotal = resp.data.data.total
          this.groupUsersPageNum = resp.data.data.pageNum
          this.groupUsersPageSize = resp.data.data.pageSize
          this.listGroupUsersLoading = false
        })
        this.showUsersDialog = true
      },
      /* 查看群组用户 */
      showUser(groupId) {
        this.groupId = groupId
        this.fetchGroupUsers(null, null, this.groupUsersPageNum, this.groupUsersPageSize)
      },
      /* =======================添加群组结束================================ */
      /* =======================设置权限开始================================ */
      /* 打开设置权限窗口 */
      setFilePermission(type, id) {
        this.permissionDialog = true
        this.checkedPermission.permissionType = type
        this.checkedPermission.id = id
        let nodes = []
        if (type === 'role') {
          nodes = this.checkedPermission.role[id] || []
        } else if (type === 'department') {
          nodes = this.checkedPermission.department[id] || []
        } else if (type === 'group') {
          nodes = this.checkedPermission.group[id] || []
        }
        setTimeout(() => {
          this.$refs.treePermission.setCheckedNodes(nodes)
        }, 0)
      },
      /* 设置权限保存按钮 */
      addSelectPermission() {
        const nodes = this.$refs['treePermission'].getCheckedNodes()
        const id = this.checkedPermission.id
        if (this.checkedPermission.permissionType === 'role') {
          this.checkedPermission.role[id] = nodes
        } else if (this.checkedPermission.permissionType === 'department') {
          this.checkedPermission.department[id] = nodes
        } else if (this.checkedPermission.permissionType === 'group') {
          this.checkedPermission.group[id] = nodes
        }
        this.checkedPermission.permissionType = null
        this.checkedPermission.id = null
        this.permissionDialog = false
      },
      /* =======================设置权限结束================================ */

      /* 添加文件夹最后保存按钮 */
      submit() {
        const roleList = this.getList(this.roleData, this.checkedPermission.role)
        let flag = false
        let hint = '角色为【'
        this.roleData.forEach(v => {
          if (!this.checkedPermission.role[v.id] || this.checkedPermission.role[v.id].length === 0) {
            flag = true
            hint += v.roleName + ','
          }
        })
        if (flag) {
          this.hint(hint)
          return
        }
        const departmentList = this.getList(this.departmentData, this.checkedPermission.department)
        hint = '部门为【'
        this.departmentData.forEach(v => {
          if (!this.checkedPermission.department[v.id] || this.checkedPermission.department[v.id].length === 0) {
            flag = true
            hint += v.departmentName + ','
          }
        })
        if (flag) {
          this.hint(hint)
          return
        }
        const groupList = this.getList(this.groupData, this.checkedPermission.group)
        hint = '群组为【'
        this.groupData.forEach(v => {
          if (!this.checkedPermission.group[v.id] || this.checkedPermission.group[v.id] !== [].length === 0) {
            flag = true
            hint += v.groupName + ','
          }
        })
        if (flag) {
          this.hint(hint)
          return
        }
        setFolderPermission(this.fileId, roleList, departmentList, groupList).then(() => {
          this.$message({
            type: 'success',
            message: '设置成功',
            duration: 2000,
            onClose: () => {
              this.clearData()
              this.$emit('closeSetPermission')
            }
          })
        })
      },
      hint(val) {
        val = val.substr(0, val.length - 1)
        val += '】未设置权限，请设置权限或者删除！'
        this.$message({
          type: 'warning',
          message: val,
          duration: 2000
        })
      },
      /* 获取角色、部门、群组的集合 */
      getList(data, checkedPermission) {
        const list = []
        data.forEach(v => {
          const id = v.id
          const permission = checkedPermission[id]
          let filePermissionIds = ''
          if (permission) {
            permission.forEach(val => {
              filePermissionIds += ',' + val.id
            })
            filePermissionIds = filePermissionIds.substr(1)
            list.push({
              id: id,
              filePermissionIds: filePermissionIds
            })
          }
        })
        return list
      },
      /* 清空数据 */
      clearData() {
        this.activeName = 'first'
        this.roleData = []
        this.departmentData = []
        this.groupData = []
        this.groupUsersData = []
        this.checkedPermission.id = null
        this.checkedPermission.permissionType = null
        this.checkedPermission.role = {}
        this.checkedPermission.department = {}
        this.checkedPermission.group = {}
      },
      handleClose(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        }).catch(() => {

        })
      },
      /* 未添加角色表格当前页事件 */
      unRoleCurrentPageChange(currentPage) {
        this.unRolePageNum = currentPage
        this.fetchUnHadRoleData(this.searchUnRoleName, this.searchUnRoleValue, this.unRolePageNum, this.unRolePageSize)
      },
      /* 未添加群组表格当前页事件 */
      unGroupCurrentPageChange(currentPage) {
        this.unGroupPageNum = currentPage
        this.fetchUnHadGroupData(this.searchGroupName, this.unGroupPageNum, this.unGroupPageSize)
      },
      /* 查看群组用户表格当前页事件 */
      groupUsersCurrentPageChange(currentPage) {
        this.groupUsersPageNum = currentPage
        this.fetchGroupUsers(null, null, this.groupUsersPageNum, this.groupUsersPageSize)
      }
    }
  }
</script>

<style scoped>
</style>
