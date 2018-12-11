<template>
  <div class="container">
    <el-row>
      <el-col :span="4">
        <h4 style="margin-top: 0;color:#606266">菜单列表</h4>
        <el-tree
          :data="treeMenu"
          node-key="id"
          ref="tree"
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          :props="defaultProps"
          @node-click="getCurrentObj">
        </el-tree>
      </el-col>
      <el-col :span="18">
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="70px" label="角色名">
                <el-input style='min-width:120px;' v-model="searchRoleName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label-width="80px" label="角色值">
                <el-input style='min-width:120px;' v-model="searchRoleValue"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button style="margin-left: 20px;" type="primary" @click="searchRole">查询</el-button>
            </el-col>
          </el-row>
          <div class="btn_box">
            <el-button class="el-button--primary hidden" code="add" @click="goAddRole">添加角色</el-button>
            <el-button class="el-button--danger hidden" code="del" :disabled="editDisabled" @click="deleteRole">删除角色</el-button>
          </div>
          <el-dialog
            title="添加角色"
            :visible.sync="roleDialog"
            width="60%"
            :before-close="handleClose">
            <el-button class="el-button--primary" style="margin:0 15px 15px; " @click="saveUsers">保存</el-button>
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
                <el-button style="margin-left: 20px;" type="primary" @click="searchUnRole">查询</el-button>
              </el-col>
            </el-row>
            <el-table
              :data="unRoleList"
              border
              fit
              tooltip-effect="dark"
              highlight-current-row
              style="width: 100%;margin-top: 20px;"
              @selection-change="handleUnRoleChange">
              <el-table-column type="selection" width="50">
              </el-table-column>
              <el-table-column prop="roleName" label="角色名" width="180">
              </el-table-column>
              <el-table-column prop="roleValue" label="角色值" width="180">
              </el-table-column>
              <el-table-column prop="roleDesc" label="角色描述">
              </el-table-column>
            </el-table>
            <el-pagination
              style="display: flex;  justify-content: flex-end;"
              background
              layout="prev, pager, next"
              :total="unRoleTotal"
              :page-size="unPageSize"
              @current-change="handleUnCurrentPageChange">
            </el-pagination>
          </el-dialog>
          <el-table
            :data="roleList"
            v-loading.body="listLoading"
            element-loading-text="拼命加载中"
            border
            fit
            tooltip-effect="dark"
            highlight-current-row
            style="width: 100%;margin-top: 20px;"
            @selection-change="handleRoleChange">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名" width="180">
            </el-table-column>
            <el-table-column prop="roleValue" label="角色值" width="180">
            </el-table-column>
            <el-table-column prop="roleDesc" label="角色描述">
            </el-table-column>
          </el-table>
          <el-pagination
            style="float:right;margin-top: 15px;"
            background
            layout="prev, pager, next"
            :total="roleTotal"
            :page-size="pageSize"
            @current-change="handleCurrentPageChange">
          </el-pagination>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import { treeFunction, listRoleByFunctionId, addRoleToFunction, removeRoleFromFunction } from '@/api/function'
  export default {
    name: 'menuAuthor',
    data() {
      return {
        treeMenu: null,
        unRoleList: null,
        roleList: null,
        listLoading: false,
        functionId: null,
        searchRoleName: null,
        searchRoleValue: null,
        searchUnRoleName: null,
        searchUnRoleValue: null,
        roleTotal: -1,
        unRoleTotal: -1,
        pageNum: 1,
        pageSize: 10,
        unPageNum: 1,
        unPageSize: 10,
        roleDialog: false,
        roleSelections: [],
        unRoleSelections: [],
        editDisabled: false,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    mounted() {
      authMenuButton(location.hash.substring(2))
      this.initTreeMenu()
    },
    methods: {
      /* 初始化菜单树 */
      initTreeMenu() {
        treeFunction().then(response => {
          this.treeMenu = response.data.data
        })
      },
      /* 已添加的角色列表 */
      roleData(functionId, roleName, roleValue, pageNum, pageSize) {
        this.listLoading = true
        listRoleByFunctionId(functionId, roleName, roleValue, 1, pageNum, pageSize).then(response => {
          this.roleList = response.data.data.rows
          this.roleTotal = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.listLoading = false
        })
      },
      /* 未添加的角色列表 */
      unRoleData(functionId, roleName, roleValue, pageNum, pageSize) {
        this.listLoading = true
        listRoleByFunctionId(functionId, roleName, roleValue, 2, pageNum, pageSize).then(response => {
          this.unRoleList = response.data.data.rows
          this.unRoleTotal = response.data.data.total
          this.unPageNum = response.data.data.pageNum
          this.unPageSize = response.data.data.pageSize
          this.listLoading = false
        })
      },
      /* 获取菜单树当前点击节点及父节点 */
      getCurrentObj(obj, node) {
        this.functionId = obj.id
        this.roleData(this.functionId, this.searchRoleName, this.searchRoleValue, this.pageNum, this.pageSize)
      },
      /* 查询已添加角色列表 */
      searchRole() {
        this.roleData(this.functionId, this.searchRoleName, this.searchRoleValue, this.pageNum, this.pageSize)
      },
      /* 查询未添加角色列表 */
      searchUnRole() {
        this.unRoleData(this.functionId, this.searchUnRoleName, this.searchUnRoleValue, this.unPageNum, this.unPageSize)
      },
      /* 已添加角色列表当前页页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.roleData(this.functionId, this.searchRoleName, this.searchRoleValue, this.pageNum, this.pageSize)
      },
      /* 未添加角色列表当前页页事件 */
      handleUnCurrentPageChange(currentPage) {
        this.unPageNum = currentPage
        this.unRoleData(this.functionId, this.searchUnRoleName, this.searchUnRoleValue, this.unPageNum, this.unPageSize)
      },
      /* 已添加列表   获取所勾选角色 */
      handleRoleChange(val) {
        this.roleSelections = val
        if (val.length > 0) {
          val.forEach(v => {
            if (v.id === 1) {
              this.editDisabled = true
            } else {
              this.editDisabled = false
            }
          })
        } else {
          this.editDisabled = false
        }
      },
      /* 未添加列表   获取所勾选角色 */
      handleUnRoleChange(val) {
        this.unRoleSelections = val
      },
      /* 添加角色 */
      goAddRole() {
        if (!this.functionId) {
          this.$message({
            type: 'warning',
            message: '请选择菜单',
            duration: '2000'
          })
          return
        }
        this.unRoleData(this.functionId, null, null, this.unPageNum, this.unPageSize)
        this.roleDialog = true
      },
      /* 保存添加角色 */
      saveUsers() {
        if (this.unRoleSelections.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: '2000'
          })
          return
        }
        this.$confirm('确认保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rows = this.unRoleSelections
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          addRoleToFunction(this.functionId, ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '保存成功',
              duration: 2000,
              onClose: () => {
                this.roleDialog = false
                this.roleData(this.functionId, this.searchRoleName, this.searchRoleValue, this.pageNum, this.pageSize)
              }
            })
          })
        })
      },
      /* 删除角色 */
      deleteRole() {
        if (this.roleSelections.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: '2000'
          })
          return
        }
        this.$confirm('此操作将永久删除该角色，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rows = this.roleSelections
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          removeRoleFromFunction(this.functionId, ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 2000,
              onClose: () => {
                this.roleData(this.functionId, this.searchRoleName, this.searchRoleValue, this.pageNum, this.pageSize)
              }
            })
          })
        })
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
        }).catch(() => {

        })
      }
    }
  }
</script>

<style scoped>
</style>
