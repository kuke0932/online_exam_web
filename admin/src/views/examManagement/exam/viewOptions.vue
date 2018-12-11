<template>
  <div class="container">
    <el-row>
      <el-table
        :data="optionsList"
        border
        fit
        tooltip-effect="dark"
        highlight-current-row
        @selection-change="handleSelectionChange"
        style="width: 100%;margin-top: 20px;">

        <el-table-column label="选项内容">
          <template slot-scope="scope">
            {{scope.row.content}}
          </template>
        </el-table-column>
        <el-table-column label="正确答案" width="100">
          <template slot-scope="scope">
            {{scope.row.isRight}}
          </template>
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  export default {
    name: 'viewOptions',
    props: {
      optionsList: {
        type: Array,
        required: true
      },
      rightAnswerIds: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        multipleSelection: []
      }
    },
    watch: {
      rightAnswerIds() {
        this.optionsList.forEach(v => {
          if (this.rightAnswerIds.search(v.id) !== -1) {
            v.isRight = '正确'
          }
        })
      }
    },
    mounted() {
      this.optionsList.forEach(v => {
        if (this.rightAnswerIds.search(v.id) !== -1) {
          v.isRight = '正确'
        }
      })
      authMenuButton(location.hash.substring(2))
    },
    methods: {
      /* 获取所勾选专题 */
      handleSelectionChange(val) {
        this.multipleSelection = val
      }
    }
  }
</script>

<style scoped>
</style>
