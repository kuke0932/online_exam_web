<template>
  <div class="container">
    <el-form ref="editForm" label-width="120px" :model="exam" :rules="rules">
      <el-popover
        ref="department"
        placement="top-start"
        width="400"
        v-model="type"
        trigger="click">
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
      </el-popover>
      <el-form-item label="部门" prop="departmentName">
        <el-input v-popover:department v-model="exam.departmentName" readonly></el-input>
      </el-form-item>
      <el-form-item label="考试名" prop="title">
        <el-input v-model="exam.title"></el-input>
      </el-form-item>
      <el-form-item label="考试简介" prop="desc">
        <el-input type="textarea" v-model="exam.desc"></el-input>
      </el-form-item>
      <el-form-item label="总题目数" prop="total">
        <el-input v-model.number="exam.total"></el-input>
      </el-form-item>
      <el-form-item label="考试类型" prop="type">
        <el-select v-model="exam.type">
          <el-option label="模拟考试" value="0"></el-option>
          <el-option label="实际考试" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否发布" prop="publishStatus">
        <el-select v-model="exam.publishStatus">
          <el-option label="否" value="0"></el-option>
          <el-option label="是" value="1"></el-option>
        </el-select>
      </el-form-item>
      <!--<el-form-item label="单选题个数" prop="singleChoice">
        <el-input v-model="exam.singleChoice"></el-input>
      </el-form-item>
      <el-form-item label="多选题个数" prop="multipleChoice">
        <el-input v-model="exam.multipleChoice"></el-input>
      </el-form-item>
      <el-form-item label="判断题个数" prop="judge">
        <el-input v-model="exam.judge"></el-input>
      </el-form-item>-->
      <el-form-item label="题目比例" style="margin-bottom: 0">
        <div class="block">
          <el-slider
            v-model="sliderData"
            range
            :show-tooltip="false"
            :max="exam.total || 100">
          </el-slider>
        </div>
      </el-form-item>
      <el-form-item style="text-align: center">
        <div :style="'width:' + firstQuestionCount * 100 / (exam.total || 100) + '%;float: left'"><p :style="'min-width: 65px;margin:0;margin-left:' + (sliderWidth * firstQuestionCount  / (this.exam.total || 100) < 65 ? (-32 + sliderWidth * firstQuestionCount / 2 / (exam.total || 100)) : 0) + 'px'">单选题{{firstQuestionCount}}</p></div>
        <div :style="'width:' + secondQuestionCount * 100 / (exam.total || 100) + '%;float: left'"><p :style="'min-width: 65px;margin:0;margin-left:' + (sliderWidth * secondQuestionCount  / (this.exam.total || 100) < 65 ? (-32 + sliderWidth * secondQuestionCount / 2 / (exam.total || 100)) : 0) + 'px'">多选题{{secondQuestionCount}}</p></div>
        <div :style="'width:' + thirdQuestionCount * 100 / (exam.total || 100) + '%;float: left'"><p :style="'min-width: 65px;margin:0;margin-left:' + (sliderWidth * thirdQuestionCount  / (this.exam.total || 100) < 65 ? (-32 + sliderWidth * thirdQuestionCount / 2 / (exam.total || 100)) : 0) + 'px'">判断题{{thirdQuestionCount}}</p></div>
      </el-form-item>
      <el-form-item label="考试范围" prop="categoryName">
        <el-input v-model="exam.categoryName" @click.native="showCategory" readonly></el-input>
      </el-form-item>
      <el-form-item label="考试开始时间" prop="startTime">
        <el-date-picker
          v-model="exam.startTime"
          type="datetime"
          :editable=false
          placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="考试截止时间" prop="endTime">
        <el-date-picker
          v-model="exam.endTime"
          type="datetime"
          :editable=false
          placeholder="选择开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="考试时长(分钟)" prop="minutesLength">
        <el-input v-model.number="exam.minutesLength"></el-input>
      </el-form-item>
      <el-form-item class="btn_box">
        <el-button type="primary" @click="submitForm('editForm')">提交</el-button>
        <el-button @click="resetForm('editForm')">重置</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="专题列表"
      :visible.sync="scopeDialogVisible"
      width="40%"
      append-to-body
      :before-close="handleClose">
      <el-form>
        <el-row>
          <el-col :span="15">
            <el-form-item label-width="70px" label="专题名">
              <el-input v-model="searchCategoryName" ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-button style="margin-left: 20px;" type="primary"  @click="search" :loading="listLoading">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
      <el-table
        ref="scopeTable"
        :data="categoryList"
        v-loading.body="listLoading"
        element-loading-text="拼命加载中"
        border
        fit
        tooltip-effect="dark"
        highlight-current-row
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column property="name" label="专题名"></el-table-column>
      </el-table>
      <el-pagination
        style="margin-top: 15px;margin-left: 400px;"
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="pageSize"
        @current-change="handleCurrentPageChange">
      </el-pagination>
      <el-button type="primary" @click="saveScope" style="margin-top: 15px;margin-bottom: -50px">确定</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import { list } from '@/api/category'
  import { getById, edit } from '@/api/exam'
  import { treeDepartment } from '@/api/department'
  import { authMenuButton } from '@/utils/authMenuButton'
  export default {
    name: 'editExam',
    props: {
      examId: Number
    },
    data() {
      return {
        sliderWidth: '',
        firstQuestionCount: '',
        secondQuestionCount: '',
        thirdQuestionCount: '',
        sliderData: [33, 66],
        total: -1,
        pageNum: 1,
        pageSize: 5,
        departmentTree: null,
        type: false,
        listLoading: false,
        scopeDialogVisible: false,
        searchCategoryName: null,
        categoryList: [],
        multipleSelection: [],
        exam: {
          departmentId: null,
          departmentName: null,
          title: null,
          desc: null,
          total: null,
          type: null,
          publishStatus: null,
          scope: null,
          categoryName: null,
          startTime: null,
          endTime: null,
          minutesLength: null
        },
        rules: {
          departmentName: [
            { required: true, message: '请输选择部门', trigger: 'change' }
          ],
          title: [
            { required: true, message: '请输入考试名', trigger: 'blur' }
          ],
          desc: [
            { required: true, message: '请输入考试简介', trigger: 'blur' }
          ],
          total: [
            { required: true, message: '请输入总题目数', trigger: 'blur' },
            { type: 'number', message: '请输入数字值', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择考试类型', trigger: 'change' }
          ],
          publishStatus: [
            { required: true, message: '请选择是否发布', trigger: 'change' }
          ],
          categoryName: [
            { required: true, message: '请选择考试范围', trigger: 'change' }
          ],
          startTime: [
            { required: true, message: '请选择考试开始时间', trigger: 'change' }
          ],
          endTime: [
            { required: true, message: '请选择考试截止时间', trigger: 'change' }
          ],
          minutesLength: [
            { required: true, message: '请输入考试时长', trigger: 'blur' },
            { type: 'number', message: '请输入数字值', trigger: 'blur' }
          ]
        },
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    watch: {
      'exam': {
        handler() {
          this.firstQuestionCount = this.sliderData[0]
          this.secondQuestionCount = this.sliderData[1] - this.sliderData[0]
          this.thirdQuestionCount = (this.exam.total || 100) - this.sliderData[1]
        },
        deep: true
      },
      'sliderData': {
        handler(newValue, oldValue) {
          this.firstQuestionCount = this.sliderData[0]
          this.secondQuestionCount = this.sliderData[1] - this.sliderData[0]
          this.thirdQuestionCount = (this.exam.total || 100) - this.sliderData[1]
        },
        deep: true
      },
      examId() {
        this.initDepartmentTree()
      }
    },
    mounted() {
      this.initDepartmentTree()
      this.fetchData(null, this.pageNum, this.pageSize)
      authMenuButton(location.hash.substring(2))
      this.sliderWidth = document.querySelector('.el-slider__runway').offsetWidth
      this.firstQuestionCount = this.sliderData[0]
      this.secondQuestionCount = this.sliderData[1] - this.sliderData[0]
      this.thirdQuestionCount = (this.exam.total || 100) - this.sliderData[1]
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

      /* 获取详情 */
      getById() {
        getById(this.examId).then(response => {
          this.exam.departmentId = response.data.data.departmentId
          this.exam.title = response.data.data.title
          this.exam.desc = response.data.data.desc
          this.exam.total = response.data.data.total
          this.exam.type = response.data.data.type + ''
          this.exam.publishStatus = response.data.data.publishStatus + ''
          this.firstQuestionCount = response.data.data.singleChoice
          this.secondQuestionCount = response.data.data.multipleChoice
          this.thirdQuestionCount = response.data.data.judge
          this.exam.categoryName = response.data.data.categoryName
          this.exam.scope = response.data.data.scope
          this.exam.startTime = response.data.data.startTime
          this.exam.endTime = response.data.data.endTime
          this.exam.minutesLength = response.data.data.minutesLength

          const first = response.data.data.singleChoice
          const second = response.data.data.singleChoice + response.data.data.multipleChoice
          this.sliderData = [first, second]
          this.$refs['tree'].setCheckedKeys([this.exam.departmentId])
          this.exam.departmentName = this.$refs['tree'].getCheckedNodes()[0].label
        })
      },

      /* 初始化部门树 */
      initDepartmentTree() {
        treeDepartment().then(response => {
          this.departmentTree = response.data.data
          this.getById()
        })
      },

      /* 树点击事件，拿当前node的id */
      handleNodeClick(data) {
        this.exam.departmentId = data.id
        this.exam.departmentName = data.label
        this.type = false
      },

      /* 打开考试范围窗口 */
      showCategory() {
        this.scopeDialogVisible = true
      },
      /* 查询 */
      search() {
        this.fetchData(
          this.searchCategoryName,
          this.pageNum,
          this.pageSize)
      },
      /* 获取所勾选专题 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      /* table表格当前页事件 */
      handleCurrentPageChange(currentPage) {
        this.pageNum = currentPage
        this.fetchData(this.searchCategoryName, this.pageNum, this.pageSize)
      },
      /* 保存所选范围 */
      saveScope() {
        let categoryName = ''
        let scope = ''
        this.multipleSelection.forEach(v => {
          categoryName += ',' + v.name
          scope += ',' + v.id
        })
        this.exam.categoryName = categoryName.substr(1)
        this.exam.scope = scope.substr(1)
        this.scopeDialogVisible = false
        this.$refs.scopeTable.clearSelection()
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const data = {
              id: this.examId,
              departmentId: this.exam.departmentId,
              title: this.exam.title,
              desc: this.exam.desc,
              total: this.exam.total,
              type: this.exam.type,
              publishStatus: this.exam.publishStatus,
              singleChoice: this.firstQuestionCount,
              multipleChoice: this.secondQuestionCount,
              judge: this.thirdQuestionCount,
              scope: this.exam.scope,
              startTime: this.exam.startTime,
              endTime: this.exam.endTime,
              minutesLength: this.exam.minutesLength
            }
            edit(
              data
            ).then(() => {
              this.$message({
                type: 'success',
                message: '修改成功!',
                duration: 1500,
                onClose: () => {
                  this.$refs[formName].resetFields()
                  this.$emit('closeAndRefresh')
                }
              })
            })
          }
        })
      },
      resetForm() {
        this.$refs['addForm'].resetFields()
      },
      /* 手动关闭对话框 */
      handleClose(done) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          done()
          this.multipleSelection = []
          this.$refs.scopeTable.clearSelection()
        }).catch(() => {

        })
      }
    }
  }
</script>

<style scoped>
</style>
