<template>
  <div class="container">
    <el-tree
      :data="treeMenu"
      node-key="id"
      ref="treeMenu"
      highlight-current
      show-checkbox
      check-strictly
      :expand-on-click-node="false"
      :props="defaultProps"
      style="padding:0 50px;">
    </el-tree>
    <div style="margin:15px 0;text-align: center" >
      <el-button class="el-button--primary" size="small " @click="addSelectPermission" >保存</el-button>
    </div>
  </div>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import { treeFunction } from '@/api/function'
  import { getRoleFunction, setFunctionToRole } from '@/api/role'
  export default {
    name: 'checkUser',
    props: {
      roleId: {
        type: Number,
        required: true
      }
    },
    data() {
      return {
        treeMenu: null,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    watch: {
      roleId(val) {
        this.initFunctionTree()
        this.getRoleFunction()
      }
    },
    mounted() {
      authMenuButton(location.hash.substring(2))
      this.initFunctionTree()
      this.getRoleFunction()
    },
    methods: {
      /* 初始化部门树 */
      initFunctionTree() {
        treeFunction().then(response => {
          const data = response.data.data
          data[0].disabled = true
          this.treeMenu = data
        })
      },
      /* 获取当前角色所拥有的菜单权限 */
      getRoleFunction() {
        getRoleFunction(this.roleId).then(response => {
          const keys = response.data.data
          keys.push(1)
          this.$refs['treeMenu'].setCheckedKeys(keys)
        })
      },
      /* 设置权限保存按钮 */
      addSelectPermission() {
        const keys = this.$refs['treeMenu'].getCheckedKeys()
        setFunctionToRole(this.roleId, keys).then(response => {
          this.$message({
            type: 'success',
            message: '保存成功',
            onClose: () => {
              this.$emit('closeViewMenu')
            }
          })
        })
      }
    }
  }
</script>
<style scoped>
</style>
