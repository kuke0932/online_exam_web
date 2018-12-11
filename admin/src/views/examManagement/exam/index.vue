<template>
  <div class="container">
    <el-row>
      <el-form>
        <el-row>
          <el-col :span="4">
            <el-form-item label-width="70px" label="部门名">
              <el-input v-model="searchDepartmentName" style='min-width:120px;'></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="70px" label="考试类型">
              <el-select v-model="searchExamType">
                <el-option label="全部" value=""></el-option>
                <el-option label="模拟考试" value="0"></el-option>
                <el-option label="实际考试" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label-width="70px" label="发布状态">
              <el-select v-model="searchPublishStatus">
                <el-option label="全部" value=""></el-option>
                <el-option label="未发布" value="0"></el-option>
                <el-option label="已发布" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item style="margin-left: 20px;">
              <el-date-picker type="date" placeholder="选择考试开始时间" v-model="searchStartDate" style="width: 175px"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item style="margin-left: 20px;">
              <el-date-picker type="date" placeholder="选择考试截止时间" v-model="searchEndDate" style="width: 175px"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button style="margin-left: 20px;" type="primary"  @click="search" :loading="listLoading">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <div class="btn_box">
        <el-button class="el-button--primary hidden" code="add" @click="addExam">新增考试</el-button>
        <el-button class="el-button--primary hidden" code="edit" @click="editExam">修改考试</el-button>
        <el-button class="el-button--danger hidden" code="del" @click="deleteExam">删除考试</el-button>
      </div>
      <el-table
        :data="examList"
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

        <el-table-column label="考试名">
          <template slot-scope="scope">
            {{scope.row.title}}
          </template>
        </el-table-column>
        <el-table-column label="考试简介">
          <template slot-scope="scope">
            {{scope.row.desc}}
          </template>
        </el-table-column>
        <el-table-column label="考试类型" width="80">
          <template slot-scope="scope">
            {{scope.row.type == 0 ? '模拟考试' : '实际考试'}}
          </template>
        </el-table-column>
        <el-table-column label="发布状态" width="80">
          <template slot-scope="scope">
            {{scope.row.publishStatus == 0 ? '未发布' : '已发布'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="270">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="viewDetail(scope.row.id)">查看详情</el-button>
            <el-button type="primary" size="small" @click="viewQuestions(scope.row.id)">查看问题</el-button>
            <el-button type="primary" size="small" v-if="scope.row.publishStatus == 0" @click="publish(scope.row.id)">发布</el-button>
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
        title="新增考试"
        :visible.sync="addDialogVisible"
        width="60%"
        :before-close="handleClose">
        <add-exam ref="addExam"
                      v-on:closeAndRefresh="closeAndRefresh">
        </add-exam>
      </el-dialog>
      <el-dialog
        title="修改考试"
        :visible.sync="editDialogVisible"
        width="60%"
        :before-close="handleClose">
        <edit-exam ref="editExam" :examId="examId"
                      v-on:closeAndRefresh="closeAndRefresh">
        </edit-exam>
      </el-dialog>
      <el-dialog
        title="查看详情"
        :visible.sync="viewDialogVisible"
        width="60%">
        <view-detail :examId="examId"
                      ref="viewDetail"
                      v-on:closeDialog="closeDialog">
        </view-detail>
      </el-dialog>
      <el-dialog
        title="查看问题"
        :visible.sync="viewQuestionsVisible"
        width="80%">
        <view-question :examId="examId"
                      ref="viewQuestions"
                      v-on:closeDialog="closeDialog">
        </view-question>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
  import { list, remove, publish } from '@/api/exam'
  import { parseTime } from '@/filters/index'
  import { authMenuButton } from '@/utils/authMenuButton'
  import AddExam from './addExam'
  import EditExam from './editExam'
  import ViewDetail from './viewDetail'
  import ViewQuestion from './viewQuestions'
  export default {
    name: 'user',
    components: {
      ViewDetail, ViewQuestion, AddExam, EditExam
    },
    data() {
      return {
        total: -1,
        pageNum: 1,
        pageSize: 10,
        examId: null,
        examList: null,
        optionsList: [],
        rightAnswerIds: '',
        searchDepartmentName: null,
        searchExamType: null,
        searchPublishStatus: null,
        searchStartDate: null,
        searchEndDate: null,
        multipleSelection: [],
        listLoading: false,
        dialogVisible: false,
        editDialogVisible: false,
        addDialogVisible: false,
        viewDialogVisible: false,
        viewQuestionsVisible: false,
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
      this.fetchData(null, null, null, null, null, this.pageNum, this.pageSize)
    },
    methods: {
      fetchData(departmentName, examType, publishStatus, startDate, endDate, pageNum, pageSize) {
        this.listLoading = true
        list(
          departmentName,
          examType,
          publishStatus,
          startDate,
          endDate,
          pageNum,
          pageSize
        ).then(response => {
          this.examList = response.data.data.rows
          this.total = response.data.data.total
          this.pageNum = response.data.data.pageNum
          this.pageSize = response.data.data.pageSize
          this.listLoading = false
        })
      },
      /* 查询 */
      search() {
        this.searchStartDate = parseTime(this.searchStartDate, '{y}-{m}-{d}')
        this.searchEndDate = parseTime(this.searchEndDate, '{y}-{m}-{d}')
        this.fetchData(
          this.searchDepartmentName,
          this.searchExamType,
          this.searchPublishStatus,
          this.searchStartDate,
          this.searchEndDate,
          this.pageNum,
          this.pageSize
        )
      },

      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.listLoading = true
        this.pageNum = currentPage
        this.fetchData(this.searchDepartmentName, this.searchExamType, this.searchPublishStatus, this.searchStartDate,
          this.searchEndDate, this.pageNum, this.pageSize)
      },
      /* 获取所勾选专题 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },

      /* 打开新增考试 */
      addExam() {
        this.addDialogVisible = true
      },

      /* 打开修改考试 */
      editExam() {
        if (this.multipleSelection.length !== 1) {
          this.$message({
            type: 'warning',
            message: '请选中一行再执行此操作!',
            duration: 2000
          })
          return
        }
        if (this.multipleSelection[0].publishStatus === 1) {
          this.$message({
            type: 'warning',
            message: '该考试已发布，禁止修改!',
            duration: 2000
          })
          return
        }
        this.examId = this.multipleSelection[0].id
        this.editDialogVisible = true
      },

      /* 删除考试 */
      deleteExam() {
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
                this.fetchData(this.searchDepartmentName, this.searchExamType, this.searchPublishStatus, this.searchStartDate,
                  this.searchEndDate, this.pageNum, this.pageSize)
              }
            })
          })
        })
      },
      /* 查看详情 */
      viewDetail(id) {
        this.examId = id
        this.viewDialogVisible = true
      },
      /* 查看问题 */
      viewQuestions(id) {
        this.examId = id
        this.viewQuestionsVisible = true
      },
      /* 发布 */
      publish(id) {
        publish(id).then(response => {
          this.$message({
            type: 'success',
            message: '发布成功',
            duration: 2000,
            onClose: () => {
              this.fetchData(this.searchDepartmentName, this.searchExamType, this.searchPublishStatus, this.searchStartDate,
                this.searchEndDate, this.pageNum, this.pageSize)
            }
          })
        })
      },
      closeAndRefresh() {
        this.fetchData(
          this.searchDepartmentName,
          this.searchExamType,
          this.searchPublishStatus,
          this.searchStartDate,
          this.searchEndDate,
          this.pageNum,
          this.pageSize
        )
        this.addDialogVisible = false
        this.editDialogVisible = false
      },
      closeDialog() {
        this.viewDialogVisible = false
        this.viewQuestionsVisible = false
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
          this.$refs['addExam'].resetForm()
        }).catch(() => {

        })
      }
    }
  }
</script>

<style scoped>
</style>
