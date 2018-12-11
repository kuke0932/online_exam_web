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
          :props="defaultProps"
          :expand-on-click-node='false'
          @node-click="currentNodeClick">
        </el-tree>
      </el-col>
      <el-col :span="18">
          <el-form>
            <el-row>
              <el-col :span="8">
                <el-form-item label-width="70px" label="部门名称">
                  <el-input style='min-width:120px;' v-model="searchDepartmentName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-button style="margin-left: 20px;" type="primary" @click="search" :loading="listLoading">查询</el-button>
              </el-col>
            </el-row>
            <div class="btn_box">
              <el-button class="el-button--primary hidden" code="add" @click="goAddDepartment">添加部门</el-button>
              <el-button class="el-button--primary hidden" code="edit" :disabled="editDisabled" @click="goEditDepartment">修改部门</el-button>
              <el-button class="el-button--danger hidden" code="del" :disabled="editDisabled" @click="deleteDepartment">删除部门</el-button>
            </div>
              <el-dialog
                title="添加部门"
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
                    node-key="id"
                    highlight-current
                    :props="defaultProps"
                    :expand-on-click-node='false'
                    :check-strictly='true'
                    @node-click="currentDepartmentAdd">
                  </el-tree>
                </el-popover>
                <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px">
                  <el-form-item label="部门名" prop="departmentName">
                    <el-input v-model="addForm.departmentName"></el-input>
                  </el-form-item>
                  <el-form-item label="父部门" prop="parentName">
                    <el-input v-model="addForm.parentName"  v-popover:popoverTree readonly></el-input>
                  </el-form-item>
                  <el-form-item label="部门描述" prop="departmentDesc">
                    <el-input type="textarea" v-model="addForm.departmentDesc"></el-input>
                  </el-form-item>
                  <el-form-item class="btn_box">
                    <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
                    <el-button @click="resetForm('addForm')">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>
              <el-dialog
                title="修改部门"
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
                    node-key="id"
                    highlight-current
                    :props="defaultProps"
                    :expand-on-click-node='false'
                    :check-strictly='true'
                    @node-click="currentDepartmentEdit">
                  </el-tree>
                </el-popover>
                <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px">
                  <el-form-item label="部门名" prop="departmentName">
                    <el-input v-model="editForm.departmentName"></el-input>
                  </el-form-item>
                  <el-form-item label="父部门" prop="parentName">
                    <el-input v-model="editForm.parentName"  v-popover:popoverTree readonly></el-input>
                  </el-form-item>
                  <el-form-item label="部门描述" prop="departmentDesc">
                    <el-input type="textarea" v-model="editForm.departmentDesc"></el-input>
                  </el-form-item>
                  <el-form-item class="btn_box">
                    <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
                    <el-button @click="resetForm('editForm')">重置</el-button>
                  </el-form-item>
                </el-form>
              </el-dialog>
            <el-table
              :data="departmentList"
              v-loading.body="listLoading"
              element-loading-text="拼命加载中"
              border
              fit
              tooltip-effect="dark"
              highlight-current-row
              style="width: 100%;margin-top: 20px;">
              <el-table-column label="部门名" width="250">
                <template slot-scope="scope">
                  {{scope.row.departmentName}}
                </template>
              </el-table-column>
              <el-table-column prop="departmentDesc" label="部门描述">
                <template slot-scope="scope">
                  {{scope.row.departmentDesc}}
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
          </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import { treeDepartment, listDepartmentByParentId,
    addDepartment, getDepartmentById,
    updateDepartment, removeDepartment } from '@/api/department'
  export default {
    name: 'department',
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        parentId: null,
        departmentTree: null,
        departmentList: null,
        searchDepartmentName: null,
        listLoading: false,
        dialogVisible: false,
        editDialogVisible: false,
        editDisabled: false,
        addForm: {
          departmentName: '',
          parentName: '',
          parentId: null,
          departmentDesc: ''
        },
        editForm: {
          departmentName: '',
          parentName: '',
          parentId: null,
          departmentDesc: ''
        },
        rules: {
          departmentName: [
            { required: true, message: '请输入部门名', trigger: 'blur' }
          ],
          parentName: [
            { required: true, message: '请选择父部门', trigger: 'change' }
          ],
          departmentDesc: [
            { required: true, message: '请输入部门描述', trigger: 'blur' }
          ]
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    mounted() {
      authMenuButton(location.hash.substring(2))
      this.initDepartmentTree()
      this.fetchData(null, null, this.pageNum, this.pageSize)
    },
    methods: {
      /* 初始化部门树 */
      initDepartmentTree() {
        treeDepartment().then(response => {
          this.departmentTree = response.data.data
        })
      },
      /* 根据父id获取子部门列表 */
      fetchData(parentId, departmentName, pageNum, pageSize) {
        this.listLoading = true
        listDepartmentByParentId(parentId, departmentName, pageNum, pageSize).then(response => {
          this.departmentList = response.data.data.rows
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.listLoading = false
        })
      },
      /* 点击当前树节点 */
      currentNodeClick(current, node) {
        this.parentId = current.id
        this.fetchData(current.id, null, this.pageNum, this.pageSize)
        if (current.id === 1) {
          this.editDisabled = true
        } else {
          this.editDisabled = false
        }
      },
      /* 查询 */
      search() {
        this.fetchData(this.parentId, this.searchDepartmentName, this.pageNum, this.pageSize)
      },
      /* 打开添加部门 */
      goAddDepartment() {
        this.dialogVisible = true
      },
      /* 打开修改部门 */
      goEditDepartment() {
        if (!this.parentId) {
          this.$message({
            type: 'warning',
            message: '请在左侧部门列表中选一行再执行此操作!'
          })
          return
        }
        getDepartmentById(this.parentId).then(resp => {
          console.log(resp.data.data)
          this.editForm.departmentName = resp.data.data.departmentName
          this.editForm.parentName = resp.data.data.parentName
          this.editForm.departmentDesc = resp.data.data.departmentDesc
        })
        this.editDialogVisible = true
      },
      /* 删除树形数组里面的node */
      iteratorTree(data, id) {
        data.forEach(v => {
          if (v.id === id) {
            const index = data.indexOf(v)
            data.splice(index, 1)
          } else {
            if (!v.children) {
              return
            }
            this.iteratorTree(v.children, id)
          }
        })
      },
      /* 删除部门 */
      deleteDepartment() {
        if (!this.parentId) {
          this.$message({
            type: 'warning',
            message: '请在左侧部门列表中选一行再执行此操作!',
            duration: '2000'
          })
          return
        }
        this.$confirm('此操作将永久删除该部门，并且与该部门有关的所有权限也将一并删除，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeDepartment(this.parentId).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 2000,
              onClose: () => {
                const id = this.$refs['tree'].getCurrentNode().id
                this.iteratorTree(this.departmentTree, id)
              }
            })
          })
        })
      },
      /* 添加修改部门提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              addDepartment(
                this.addForm.departmentName,
                this.addForm.parentId,
                this.addForm.departmentDesc
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1500,
                  onClose: () => {
                    this.initDepartmentTree()
                    this.fetchData(null, null, this.pageNum, this.pageSize)
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                  }
                })
              })
            } else if (formName === 'editForm') {
              updateDepartment(
                this.parentId,
                this.editForm.departmentName,
                this.editForm.parentId,
                this.editForm.departmentDesc
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1500,
                  onClose: () => {
                    this.initDepartmentTree()
                    this.fetchData(null, null, this.pageNum, this.pageSize)
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
      },
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.parentId, this.searchDepartmentName, this.pageNum, this.pageSize)
      },
      /* 修改选择当前点击部门 */
      currentDepartmentEdit() {
        const nodes = this.$refs['treeEdit'].getCurrentNode()
        this.editForm.parentName = nodes.label
        this.editForm.parentId = nodes.id
      },
      /* 添加选择当前点击部门 */
      currentDepartmentAdd() {
        const nodes = this.$refs['treeAdd'].getCurrentNode()
        this.addForm.parentName = nodes.label
        this.addForm.parentId = nodes.id
      }
    }
  }
</script>

<style scoped>
</style>
