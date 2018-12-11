<template>
  <div class="container">
    <el-row>
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item label-width="70px" label="专题名">
                <el-input v-model="searchCategoryName" style='min-width:120px;'></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-button style="margin-left: 20px;" type="primary"  @click="search" :loading="listLoading">查询</el-button>
            </el-col>
          </el-row>
        </el-form>
        <div class="btn_box">
          <el-button class="el-button--primary hidden" code="add" @click="goAddCategory">添加专题</el-button>
          <el-button class="el-button--primary hidden" code="edit" @click="goEditCategory">修改专题</el-button>
          <el-button class="el-button--danger hidden" code="del" @click="deleteCategory">删除专题</el-button>
        </div>
          <el-table
            :data="categoryList"
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

            <el-table-column label="专题名">
              <template slot-scope="scope">
                {{scope.row.name}}
              </template>
            </el-table-column>
            <el-table-column label="排序">
              <template slot-scope="scope">
                {{scope.row.sort}}
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
        title="添加专题"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">

        <el-form ref="addForm" :rules="rules" :model="addForm" label-width="80px">
          <el-form-item label="专题名" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input v-model.number="addForm.sort"></el-input>
          </el-form-item>

          <el-form-item class="btn_box">
            <el-button type="primary" @click="submitForm('addForm')">提交</el-button>
            <el-button @click="resetForm('addForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <el-dialog
        title="修改专题"
        :visible.sync="editDialogVisible"
        width="40%"
        :before-close="handleClose">

        <el-form ref="editForm" :rules="rules" :model="editForm" label-width="80px">
          <el-form-item label="专题名" prop="name">
            <el-input v-model="editForm.name"></el-input>
          </el-form-item>

          <el-form-item label="排序" prop="sort">
            <el-input v-model.number="editForm.sort"></el-input>
          </el-form-item>

          <el-form-item class="btn_box">
            <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
            <el-button @click="resetForm('editForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import { list, getById, add, edit, remove } from '@/api/category'
  import { authMenuButton } from '@/utils/authMenuButton'
  export default {
    name: 'user',
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        categoryId: null,
        categoryList: null,
        searchCategoryName: '',
        multipleSelection: [],
        listLoading: false,
        dialogVisible: false,
        editDialogVisible: false,
        addForm: {
          name: '',
          sort: 0
        },
        editForm: {
          id: '',
          name: '',
          sort: 0
        },
        rules: {
          name: [
            { required: true, message: '请输入专题名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在3到10个字符之间', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '请输入排序', trigger: 'blur' },
            { type: 'number', message: '请输入正确的数字', trigger: 'blur' }
          ]
        }
      }
    },
    updated() {
      authMenuButton(location.hash.substring(2))
    },
    mounted() {
      authMenuButton(location.hash.substring(2))
      this.fetchData('', this.pageNum, this.pageSize)
    },
    methods: {
      fetchData(name, pageNum, pageSize) {
        this.listLoading = true
        list(
          name,
          pageNum,
          pageSize
        ).then(response => {
          this.categoryList = response.data.data.rows
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.listLoading = false
        })
      },
      /* 查询 */
      search() {
        this.fetchData(
          this.searchCategoryName,
          this.pageNum,
          this.pageSize)
      },

      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.listLoading = true
        this.pageNum = currentPage
        this.fetchData(this.searchCategoryName, this.pageNum, this.pageSize)
      },
      /* 获取所勾选专题 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* 打开添加窗口 */
      goAddCategory() {
        this.dialogVisible = true
      },
      /* 打开修改窗口 */
      goEditCategory() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!'
          })
          return
        }

        this.categoryId = this.multipleSelection[0].id
        getById(this.multipleSelection[0].id).then(response => {
          const category = response.data.data

          this.editForm.id = category.id
          this.editForm.name = category.name
          this.editForm.sort = category.sort
        })
        this.editDialogVisible = true
      },
      /* 删除专题 */
      deleteCategory() {
        if (this.multipleSelection.length === 0) {
          this.$message({
            type: 'warning',
            message: '请至少选中一行再执行此操作!',
            duration: 2000
          })
          return
        }
        this.$confirm('此操作将永久删除该专题，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const rows = this.multipleSelection
          const ids = []
          for (let i = 0; i < rows.length; i++) {
            ids.push(rows[i].id)
          }
          remove(ids.join(',')).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 2000,
              onClose: () => {
                this.fetchData(this.searchCategoryName, this.pageNum, this.pageSize)
              }
            })
          })
        })
      },
      /* 添加修改提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              add(
                this.addForm.name,
                this.addForm.sort
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1500,
                  onClose: () => {
                    this.fetchData(this.searchCategoryName, this.pageNum, this.pageSize)
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                  }
                })
              })
            } else if (formName === 'editForm') {
              edit(
                this.categoryId,
                this.editForm.name,
                this.editForm.sort
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1500,
                  onClose: () => {
                    this.fetchData(this.searchCategoryName, this.pageNum, this.pageSize)
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
      }
    }
  }
</script>

<style scoped>
</style>
