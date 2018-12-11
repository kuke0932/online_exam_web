<template>
  <div class="container">
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
          <el-button style="margin-left: 20px;" type="primary" @click="search" :loading="listLoading">查询</el-button>
        </el-col>
      </el-row>
      <div class="btn_box">
        <el-button class="el-button--primary hidden" code="add" @click="goAddRole">添加角色</el-button>
        <el-button class="el-button--primary hidden" code="edit" :disabled="editDisabled" @click="goEditRole">修改角色</el-button>
        <el-button class="el-button--danger hidden" code="del" :disabled="editDisabled" @click="deleteRole">删除角色</el-button>
      </div>
      <el-dialog
        title="添加角色 "
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
        <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色值" prop="roleValue">
            <el-input v-model="addForm.roleValue"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input type="textarea" v-model="addForm.roleDesc"></el-input>
          </el-form-item>
          <el-form-item class="btn_box">
            <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
            <el-button @click="resetForm('addForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        title="修改角色"
        :visible.sync="editDialogVisible"
        width="40%"
        :before-close="handleClose">
        <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色值" prop="roleValue">
            <el-input v-model="editForm.roleValue"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input type="textarea" v-model="editForm.roleDesc"></el-input>
          </el-form-item>
          <el-form-item class="btn_box">
            <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
            <el-button @click="resetForm('editForm')">重置</el-button>
          </el-form-item>
        </el-form>
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
        @selection-change="handleSelectionChange">
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
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button class="el-button--primary" code="add" size="small" @click="viewUser(scope.row.id)">查看用户</el-button>
            <el-button class="el-button--primary" code="add" size="small" @click="viewMenu(scope.row.id)">查看菜单</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="float:right;margin-top: 15px;"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="handleCurrentPageChange">
      </el-pagination>
      <el-dialog
        title="查看用户"
        :visible.sync="viewUserDialogVisible"
        width="80%"
        :before-close="handleClose">
        <view-user :roleId="roleId"></view-user>
      </el-dialog>
      <el-dialog
        title="选择菜单"
        :visible.sync="viewMenuDialogVisible"
        width="40%"
        :before-close="handleClose">
        <view-menu :roleId="roleId" v-on:closeViewMenu="closeViewMenu"></view-menu>
      </el-dialog>
    </el-form>
  </div>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import { listRole, addRole, updateRole, removeRole } from '@/api/role'
  import ViewUser from './viewUser'
  import ViewMenu from './viewMenu'
  export default {
    name: 'role',
    components: {
      ViewUser, ViewMenu
    },
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        roleList: null,
        multipleSelection: [],
        searchRoleName: null,
        searchRoleValue: null,
        listLoading: false,
        dialogVisible: false,
        editDialogVisible: false,
        viewUserDialogVisible: false,
        viewMenuDialogVisible: false,
        editDisabled: false,
        roleId: null,
        addForm: {
          roleName: '',
          roleValue: '',
          roleDesc: ''
        },
        editForm: {
          roleName: '',
          roleValue: '',
          roleDesc: ''
        },
        rules: {
          roleName: [
            { required: true, message: '请输入角色名', trigger: 'blur' }
          ],
          roleValue: [
            { required: true, message: '请输入角色值', trigger: 'blur' }
          ],
          roleDesc: [
            { required: true, message: '请选择角色描述', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      authMenuButton(location.hash.substring(2))
      this.fetchData(null, null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 初始化角色列表 */
      fetchData(roleName, roleValue, pageNum, pageSize) {
        this.listLoading = true
        listRole(
          roleName,
          roleValue,
          pageNum,
          pageSize
        ).then(response => {
          this.roleList = response.data.data.rows
          this.roleList.forEach((e, i) => { e['idx'] = i })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.listLoading = false
        })
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.searchRoleName, this.searchRoleValue, this.pageNum, this.pageSize)
      },
      /* 获取所勾选用户 */
      handleSelectionChange(val) {
        this.multipleSelection = val
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
      /* 查询 */
      search() {
        this.fetchData(this.searchRoleName, this.searchRoleValue, this.pageNum, this.pageSize)
      },
      /* 打开添加角色对话框 */
      goAddRole() {
        this.dialogVisible = true
      },
      /* 打开修改角色对话框 */
      goEditRole() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        const role = this.multipleSelection[0]
        this.editForm.id = role.id
        this.editForm.roleName = role.roleName
        this.editForm.roleValue = role.roleValue
        this.editForm.roleDesc = role.roleDesc
        this.editDialogVisible = true
      },
      /* 删除角色 */
      deleteRole() {
        if (this.multipleSelection.length < 1) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作',
            duration: '2000'
          })
          return
        }
        this.$confirm('此操作将永久删除该角色，并且与该角色有关的所有权限也将一并删除，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rows = this.multipleSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          removeRole(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 2000,
              onClose: () => {
                this.fetchData(null, null, this.pageNum, this.pageSize)
              }
            })
          })
        })
      },
      /* 添加、修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              const roleId = this.roleList.length !== 0 ? this.roleList[this.roleList.length - 1].id + 1 : 1
              addRole(
                roleId,
                this.addForm.roleName,
                this.addForm.roleValue,
                this.addForm.roleDesc
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1500,
                  onClose: () => {
                    this.fetchData(this.searchRoleName, this.searchRoleValue, this.pageNum, this.pageSize)
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                  }
                })
              })
            } else if (formName === 'editForm') {
              const roleId = this.multipleSelection[0].id
              updateRole(
                roleId,
                this.editForm.roleName,
                this.editForm.roleValue,
                this.editForm.roleDesc
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1500,
                  onClose: () => {
                    const newList = Object.assign(
                      this.roleList[this.multipleSelection[0].idx],
                      {
                        id: roleId
                      },
                      this.editForm
                    )
                    this.editDialogVisible = false
                    this.$set(this.roleList, this.multipleSelection[0].idx, newList)
                    this.$refs[formName].resetFields()
                    this.editDialogVisible = false
                  }
                })
              })
            }
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      /* 打开查看用户 */
      viewUser(roleId) {
        this.roleId = Number.parseInt(roleId)
        this.viewUserDialogVisible = true
      },
      /* 打开查看菜单 */
      viewMenu(roleId) {
        this.roleId = Number.parseInt(roleId)
        this.viewMenuDialogVisible = true
      },
      closeViewMenu() {
        this.viewMenuDialogVisible = false
      },
      /* 重置表单 */
      resetForm(formName) {
        this.$refs[formName].resetFields()
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.$refs['addForm'].resetFields()
          this.$refs['editForm'].resetFields()
        }).catch(() => {

        })
      }
    }
  }
</script>

<style scoped>
</style>
