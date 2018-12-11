<template>
  <div class="container">
    <el-form label-width="100px" :model="exam">
      <el-form-item label="考试名">
        <el-input v-model="exam.title" readonly></el-input>
      </el-form-item>
      <el-form-item label="考试简介">
        <el-input type="textarea" v-model="exam.desc" readonly></el-input>
      </el-form-item>
      <el-form-item label="总题目数">
        <el-input v-model="exam.total" readonly></el-input>
      </el-form-item>
      <el-form-item label="考试类型">
        <el-input v-model="exam.type == 0? '模拟考试': '实际考试'" readonly></el-input>
      </el-form-item>
      <el-form-item label="发布状态">
        <el-input v-model="exam.publishStatus == 0? '未发布': '已发布'" readonly></el-input>
      </el-form-item>
      <el-form-item label="发布时间">
        <el-input v-model="exam.publishTime" readonly></el-input>
      </el-form-item>
      <el-form-item label="单选题个数">
        <el-input v-model="exam.singleChoice" readonly></el-input>
      </el-form-item>
      <el-form-item label="多选题个数">
        <el-input v-model="exam.multipleChoice" readonly></el-input>
      </el-form-item>
      <el-form-item label="判断题个数">
        <el-input v-model="exam.judge" readonly></el-input>
      </el-form-item>
      <el-form-item label="考试范围">
        <el-input v-model="exam.categoryName" readonly></el-input>
      </el-form-item>
      <el-form-item label="考试开始时间">
        <el-input v-model="exam.startTime" readonly></el-input>
      </el-form-item>
      <el-form-item label="考试截止时间">
        <el-input v-model="exam.endTime" readonly></el-input>
      </el-form-item>
      <el-form-item label="考试时长">
        <el-input v-model="exam.minutesLength + '分钟'" readonly></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getById } from '@/api/exam'
  import { parseTime } from '@/filters/index'
  import { authMenuButton } from '@/utils/authMenuButton'
  export default {
    name: 'viewDetail',
    props: {
      examId: Number
    },
    data() {
      return {
        exam: {},
        listLoading: false,
        multipleSelection: []
      }
    },
    watch: {
      examId() {
        this.fetchData()
      }
    },
    mounted() {
      this.fetchData()
      authMenuButton(location.hash.substring(2))
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getById(
          this.examId
        ).then(response => {
          this.exam = response.data.data
          this.exam.publishTime = parseTime(this.exam.publishTime)
          this.exam.startTime = parseTime(this.exam.startTime)
          this.exam.endTime = parseTime(this.exam.endTime)
          this.listLoading = false
        })
      }
    }
  }
</script>

<style scoped>
</style>
