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
        <el-table-column label="问题名">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>
        <el-table-column label="类型" width="80">
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
        width="60%"
        append-to-body>
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
  import { listQuestionsByExamId } from '@/api/exam'
  import { authMenuButton } from '@/utils/authMenuButton'
  import ViewOptions from './viewOptions'
  export default {
    name: 'user',
    components: {
      ViewOptions
    },
    props: {
      examId: Number
    },
    data() {
      return {
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
        viewDialogVisible: false
      }
    },
    watch: {
      examId() {
        this.fetchData(null, null, this.pageNum, this.pageSize)
        authMenuButton(location.hash.substring(2))
      }
    },
    mounted() {
      this.fetchData(null, null, this.pageNum, this.pageSize)
      authMenuButton(location.hash.substring(2))
    },
    methods: {
      fetchData(categoryName, questionName, pageNum, pageSize) {
        this.listLoading = true
        listQuestionsByExamId(
          this.examId,
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
      }
    }
  }
</script>

<style scoped>
</style>
