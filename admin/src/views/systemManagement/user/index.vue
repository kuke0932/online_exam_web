<template>
  <div class="container">
    <el-row>
    <el-col :span="4">
      <h4 style="margin-top: 0;color:#606266">部门列表</h4>
      <el-tree
        :data="departmentTree"
        node-key="id"
        ref="tree"
        highlight-current
        default-expand-all
        :expand-on-click-node="false"
        :props="defaultProps"
        @node-click="handleNodeClick">
      </el-tree>
    </el-col>
    <el-col :span="18">
      <el-form>
        <el-row>
          <el-col :span="8">
            <el-form-item label-width="70px" label="登录名">
              <el-input v-model="searchLoginName" style='min-width:120px;'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="9">
            <el-form-item label-width="80px" label="用户昵称">
              <el-input v-model="searchUserName" style='min-width:120px;'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button style="margin-left: 20px;" type="primary"  @click="search" :loading="listLoading">查询</el-button>
          </el-col>
        </el-row>
        <div class="btn_box">
          <el-button class="el-button--primary hidden" code="add" @click="goAddUser">添加用户</el-button>
          <el-button class="el-button--primary hidden" :disabled="editDisabled" code="edit" @click="goEditUser">修改用户</el-button>
          <el-button class="el-button--danger hidden" :disabled="editDisabled" code="del" @click="deleteUser">删除用户</el-button>
        </div>
        <el-dialog
          title="添加用户"
          :visible.sync="dialogVisible"
          width="40%"
          :before-close="handleClose">
          <el-popover
            ref="popoverTree"
            placement="bottom-start"
            title="部门列表"
            width="400"
            trigger="click">
            <el-tree
              :data="departmentTree"
              ref="treeAdd"
              show-checkbox
              node-key="id"
              highlight-current
              :props="defaultProps"
              :expand-on-click-node='false'
              :check-strictly='true'
              @check-change="currentDepartmentAdd">
            </el-tree>
          </el-popover>
          <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px">
            <el-form-item label="登录名" prop="loginName">
              <el-input v-model="addForm.loginName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="loginPwd">
              <el-input type="password" v-model="addForm.loginPwd"></el-input>
            </el-form-item>
            <el-form-item label="部门" prop="department">
              <el-input v-model="addForm.department" v-popover:popoverTree readonly></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="userName">
              <el-input v-model="addForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="addForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="座机号" prop="telephone">
              <el-input v-model="addForm.telephone"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="addForm.email"></el-input>
            </el-form-item>
            <el-form-item class="btn_box">
              <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
              <el-button @click="resetForm('addForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-dialog
          title="修改用户"
          :visible.sync="editDialogVisible"
          width="40%"
          :before-close="handleClose">
          <el-popover
            ref="popoverTree"
            placement="bottom-start"
            title="部门列表"
            width="400"
            trigger="click">
            <el-tree
              :data="departmentTree"
              ref="treeEdit"
              show-checkbox
              node-key="id"
              highlight-current
              :props="defaultProps"
              :expand-on-click-node='false'
              :check-strictly='true'
              @check-change="currentDepartmentEdit">
            </el-tree>
          </el-popover>
          <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px">
            <el-form-item label="登录名">
              <el-input v-model="editForm.loginName" readonly></el-input>
            </el-form-item>
            <el-form-item label="部门" prop="department">
              <el-input v-model="editForm.department" v-popover:popoverTree readonly></el-input>
            </el-form-item>
            <el-form-item label="用户昵称" prop="userName">
              <el-input v-model="editForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="座机号" prop="telephone">
              <el-input v-model="editForm.telephone"></el-input>
            </el-form-item>
            <el-form-item label="电子邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>
            <el-form-item class="btn_box">
              <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
              <el-button @click="resetForm('editForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-table
          :data="userList"
          v-loading.body="listLoading"
          element-loading-text="拼命加载中"
          border
          fit
          tooltip-effect="dark"
          highlight-current-row
          @selection-change="handleSelectionChange"
          style="width: 100%;margin-top: 20px;">
          <el-table-column
            type="selection"
            width="50">
          </el-table-column>
          <el-table-column label="登录名">
            <template slot-scope="scope">
              {{scope.row.loginName}}
            </template>
          </el-table-column>
          <el-table-column label="部门">
            <template slot-scope="scope">
              {{scope.row.departmentName}}
            </template>
          </el-table-column>
          <el-table-column label="用户昵称">
            <template slot-scope="scope">
              {{scope.row.userName}}
            </template>
          </el-table-column>
          <el-table-column label="手机号">
            <template slot-scope="scope">
              {{scope.row.mobile}}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              {{scope.row.status == 1 ? '正常' : '冻结'}}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200">
            <template slot-scope="scope">
              <el-button  class="hidden" style="margin-left: 10px;" type="primary" code="on_off" size="small"  @click="checkStatus(scope.$index, scope.row.id, scope.row.status)">
                {{scope.row.status == 1 ? '禁用' : '启用'}}
              </el-button>
              <el-button class="hidden" type="primary" size="small" code="reset" :disabled="editDisabled" @click="edit(scope.row.id)">重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog
          title="重置密码"
          :visible.sync="resetPasswordVisible"
          width="30%"
          :before-close="handleClose">
          <el-form ref="resetPasswordForm" :rules="resetRules" :model="resetPasswordForm" label-width="80px">
            <el-form-item label="密码" prop="loginPwd">
              <el-input type="password" v-model="resetPasswordForm.loginPwd" auto-complete="off" placeholder="请输入6位以上密码"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="resetSubmit('resetPasswordForm')">提交</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
        <el-pagination
          style="float:right;margin-top: 15px;"
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          @current-change="handleCurrentPageChange">
        </el-pagination>
      </el-form>
    </el-col>
  </el-row>
  </div>
</template>

<script>
  import { addUser, updateUser,
    removeUser, getUserById, listUser,
    updateStatus, resetPassword } from '@/api/user'
  import { treeDepartment } from '@/api/department'
  import { authMenuButton } from '@/utils/authMenuButton'
  export default {
    name: 'user',
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        userId: null,
        userList: null,
        searchLoginName: '',
        searchUserName: '',
        departmentId: null,
        multipleSelection: [],
        editDisabled: false,
        listLoading: false,
        departmentTree: null,
        dialogVisible: false,
        editDialogVisible: false,
        resetPasswordVisible: false,
        addForm: {
          loginName: '',
          loginPwd: '',
          department: '',
          userName: '',
          mobile: '',
          telephone: '',
          email: ''
        },
        editForm: {
          department: '',
          userName: '',
          mobile: '',
          telephone: '',
          email: ''
        },
        resetPasswordForm: {
          loginPwd: null
        },
        resetRules: {
          loginPwd: [
            { required: true, message: '请输入新密码', trigger: 'blur' },
            { min: 6, message: '请输入6位以上密码', trigger: 'blur' }
          ]
        },
        rules: {
          loginName: [
            { required: true, message: '请输入登录名', trigger: 'blur' }
            // { min: 3, max: 10, message: '长度在3到10个字符之间', trigger: 'blur' }
          ],
          loginPwd: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, max: 12, message: '长度在6到12个字符之间', trigger: 'blur' }
          ],
          department: [
            { required: true, message: '请选择部门' }
          ],
          userName: [
            { required: true, message: '请输入用户昵称', trigger: 'blur' }
            // { min: 3, max: 12, message: '长度在3到12个字符之间', trigger: 'blur' }
          ],
          mobile: [
            { required: true, message: '请输入手机号', trigger: 'blur' },
            { pattern: /(13\d|14[579]|15[^4\D]|17[^49\D]|18\d)\d{8}/, message: '手机号格式错误', trigger: 'blur' }
          ],
          telephone: [
            { pattern: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/, message: '座机号格式错误', trigger: 'blur' }
          ],
          email: [
            { required: true, message: '请输入电子邮箱', trigger: 'blur' },
            { pattern: /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/, message: '邮箱格式错误', trigger: 'blur' }
          ]
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    updated() {
      authMenuButton(location.hash.substring(2))
    },
    mounted() {
      authMenuButton(location.hash.substring(2))
      this.initDepartmentTree()
      this.fetchData(null, '', '', 1, this.pageNum, this.pageSize)
    },
    methods: {
      /* 树点击事件，拿当前node的id */
      handleNodeClick(data) {
        this.departmentId = data.id
        if (!data.parentId) {
          this.departmentId = null
        }
        this.fetchData(this.departmentId, '', '', 1, this.pageNum, this.pageSize)
      },
      /* 初始化部门树 */
      initDepartmentTree() {
        treeDepartment().then(response => {
          this.departmentTree = response.data.data
        })
      },
      /* 获取部门下用户信息 */
      fetchData(departmentId, loginName, userName, showOrAdd = 1, pageNum, pageSize) {
        this.listLoading = true
        listUser(
          departmentId,
          loginName,
          userName,
          showOrAdd,
          pageNum,
          pageSize
        ).then(response => {
          this.userList = response.data.data.rows
          this.userList.forEach((e, i) => { e['idx'] = i })
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.listLoading = false
        })
      },
      /* 查询 */
      search() {
        this.fetchData(this.departmentId,
          this.searchLoginName,
          this.searchUserName,
          1,
          this.pageNum,
          this.pageSize)
      },
      /* 启用禁用 */
      checkStatus(index, id, status) {
        status = (status === 1) ? 0 : 1
        updateStatus(id, status).then(() => {
          this.$message({
            type: 'success',
            message: '操作成功!',
            duration: 1000,
            onClose: () => {
              this.userList[index].status = status
            }
          })
        })
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.listLoading = true
        this.pageNum = currentPage
        this.fetchData(this.departmentId, this.searchLoginName, this.searchUserName, 1, this.pageNum, this.pageSize)
      },
      /* 打开重置密码窗口 */
      edit(userId) {
        if (userId === 1) {
          this.$message.error('该用户不能修改！')
          return
        }
        this.userId = userId
        this.resetPasswordVisible = true
      },
      /* 重置密码提交 */
      resetSubmit(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            resetPassword(this.userId, this.resetPasswordForm.loginPwd).then(() => {
              this.$message({
                type: 'success',
                message: '重置成功',
                duration: 2000,
                onClose: () => {
                  this.resetPasswordVisible = false
                  this.$refs[formName].resetFields()
                }
              })
            })
          }
        })
      },
      /* 打开添加窗口 */
      goAddUser() {
        this.dialogVisible = true
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
      /* 打开修改窗口 */
      goEditUser() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }
        getUserById(this.multipleSelection[0].id).then(response => {
          const user = response.data.data
          let departmentName = ''
          this.$refs['treeEdit'].setCheckedKeys(user.departmentIdList)
          this.$refs['treeEdit'].getCheckedNodes() && this.$refs['treeEdit'].getCheckedNodes().forEach(v => {
            departmentName += '，' + v.label
          })
          this.editForm.id = user.id
          this.editForm.loginName = user.loginName
          this.editForm.department = departmentName.substr(1)
          this.editForm.userName = user.userName
          this.editForm.mobile = user.mobile
          this.editForm.telephone = user.telephone
          this.editForm.email = user.email
        })
        this.editDialogVisible = true
      },
      /* 删除用户 */
      deleteUser() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作!',
            duration: 2000
          })
          return
        }
        this.$confirm('此操作将永久删除该用户，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rows = this.multipleSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          removeUser(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 2000,
              onClose: () => {
                this.fetchData(this.departmentId, '', '', 1, this.pageNum, this.pageSize)
              }
            })
          })
        })
      },
      /* 添加修改提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let departmentIds = ''
            if (formName === 'addForm') {
              const nodes = this.$refs['treeAdd'].getCheckedNodes()
              nodes.forEach(v => {
                departmentIds += ',' + v.id
              })
              addUser(
                this.addForm.loginName,
                this.addForm.loginPwd,
                departmentIds.substr(1),
                this.addForm.userName,
                this.addForm.mobile,
                this.addForm.telephone,
                this.addForm.email
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1500,
                  onClose: () => {
                    this.fetchData(this.departmentId, '', '', 1, this.pageNum, this.pageSize)
                    this.$refs[formName].resetFields()
                    this.$refs['treeAdd'].setCheckedNodes()
                    this.dialogVisible = false
                  }
                })
              })
            } else if (formName === 'editForm') {
              const nodes = this.$refs['treeEdit'].getCheckedNodes()
              nodes.forEach(v => {
                departmentIds += ',' + v.id
              })
              updateUser(
                this.editForm.id,
                departmentIds.substr(1),
                this.editForm.userName,
                this.editForm.mobile,
                this.editForm.telephone,
                this.editForm.email
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1500,
                  onClose: () => {
                    const u = Object.assign(
                      this.userList[this.multipleSelection[0].idx], {
                        departmentIdList: departmentIds,
                        departmentNameList: this.editForm.department
                      },
                      this.editForm)
                    this.editDialogVisible = false
                    this.$set(this.userList, this.multipleSelection[0].idx, u)
                    this.$refs[formName].resetFields()
                    this.$refs['treeEdit'].setCheckedNodes()
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
          this.$refs['resetPasswordForm'].resetFields()
        }).catch(() => {

        })
      },
      /* 修改选择当前点击部门 */
      currentDepartmentEdit() {
        const nodes = this.$refs['treeEdit'].getCheckedNodes()
        let departmentName = ''
        nodes.forEach(v => {
          departmentName += '，' + v.label
        })
        this.editForm.department = departmentName.substr(1)
      },
      /* 添加选择当前点击部门 */
      currentDepartmentAdd() {
        const nodes = this.$refs['treeAdd'].getCheckedNodes()
        let departmentName = ''
        nodes.forEach(v => {
          departmentName += '，' + v.label
        })
        this.addForm.department = departmentName.substr(1)
      }
    }
  }
</script>

<style scoped>
</style>
