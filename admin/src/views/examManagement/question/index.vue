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
          <el-col :span="8">
            <el-form-item label-width="70px" label="试题题目">
              <el-input v-model="searchQuestionName" style='min-width:120px;'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button style="margin-left: 20px;" type="primary"  @click="search" :loading="listLoading">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="btn_box">
        <el-upload
          style="display: inline-block"
          action="/system/admin/question/import"
          :on-success="handleSuccess"
          :before-start="beforeStart"
          accept=".xls,.xlsx"
          :show-file-list="false"
          :headers="headers">
          <el-button class="hidden" code="import" type="primary">导入问题</el-button>
        </el-upload>
        <el-button class="el-button--danger hidden" code="del" @click="deleteQuestion">删除试题</el-button>
      </div>
      <el-table
        :data="questionList"
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
            {{scope.row.categoryName}}
          </template>
        </el-table-column>
        <el-table-column label="试题题目"  width="600">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column label="试题类型" width="80">
          <template slot-scope="scope">
            {{scope.row.type == 1 ? '单选' : scope.row.type == 3 ? '判断' : '多选'}}
          </template>
        </el-table-column>
        <el-table-column label="排序" width="50">
          <template slot-scope="scope">
            {{scope.row.sort}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="viewOptions(scope.row.id)">查看选项</el-button>
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
        title="查看选项"
        :visible.sync="viewDialogVisible"
        width="60%">
        <view-options :optionsList="optionsList"
                      :rightAnswerIds="rightAnswerIds"
                      ref="addFile"
                      v-on:closeDialog="closeDialog">
        </view-options>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import { list, getById, add, edit, remove } from '@/api/question'
  import { authMenuButton } from '@/utils/authMenuButton'
  import { getToken } from '@/utils/auth'
  import ViewOptions from './viewOptions'
  export default {
    name: 'user',
    components: {
      ViewOptions
    },
    data() {
      return {
        headers: {
          'x-auth-token': getToken()
        },
        total: -1,
        pageNum: 1,
        pageSize: 10,
        questionId: null,
        questionList: null,
        optionsList: [],
        rightAnswerIds: '',
        searchCategoryName: '',
        searchQuestionName: '',
        multipleSelection: [],
        listLoading: false,
        dialogVisible: false,
        editDialogVisible: false,
        viewDialogVisible: false,
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
      this.fetchData('', '', this.pageNum, this.pageSize)
    },
    methods: {
      fetchData(categoryName, questionName, pageNum, pageSize) {
        this.listLoading = true
        list(
          categoryName,
          questionName,
          pageNum,
          pageSize
        ).then(response => {
          this.questionList = response.data.data.rows
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
          this.searchQuestionName,
          this.pageNum,
          this.pageSize
        )
      },

      /* 上传之前对文件格式和大小做验证 */
      beforeStart(file) {
        const isLt2M = file.size / 1024 / 1024 < 10
        if (!isLt2M) {
          this.$message({
            type: 'warning',
            message: '上传文件大小不能超过 10MB!'
          })
        }
        return isLt2M
      },

      /* 文件上传成功后回调 */
      handleSuccess(response, file, fileList) {
        this.$message({
          type: 'success',
          message: '导入成功'
        })
        this.fetchData(null, null, this.pageNum, this.pageSize)
      },

      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.listLoading = true
        this.pageNum = currentPage
        this.fetchData(this.searchCategoryName, this.searchQuestionName, this.pageNum, this.pageSize)
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

        this.questionId = this.multipleSelection[0].id
        getById(this.multipleSelection[0].id).then(response => {
          const question = response.data.data

          this.editForm.id = question.id
          this.editForm.name = question.name
          this.editForm.sort = question.sort
        })
        this.editDialogVisible = true
      },
      /* 删除专题 */
      deleteQuestion() {
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
                this.fetchData(this.searchCategoryName, this.searchQuestionName, this.pageNum, this.pageSize)
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
                    this.fetchData(this.searchCategoryName, this.searchQuestionName, this.pageNum, this.pageSize)
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                  }
                })
              })
            } else if (formName === 'editForm') {
              edit(
                this.questionId,
                this.editForm.name,
                this.editForm.sort
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1500,
                  onClose: () => {
                    this.fetchData(this.searchCategoryName, this.searchQuestionName, this.pageNum, this.pageSize)
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
      /* 查看选项 */
      viewOptions(id) {
        this.questionId = id
        this.viewDialogVisible = true
        this.questionList.forEach(v => {
          if (v.id === id) {
            this.rightAnswerIds = v.rightAnswerIds
            this.optionsList = v.questionOptions
          }
        })
      },
      closeDialog() {
        this.viewDialogVisible = false
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
      }
    }
  }
</script>

<style scoped>
</style>
