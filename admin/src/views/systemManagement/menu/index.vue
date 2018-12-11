<template>
  <div class="container">
    <el-row>
      <div class="btn_box" style="margin-bottom: 15px;">
        <el-button class="el-button--primary" size="small" code="add" @click="goAddMenu">添加菜单</el-button>
        <el-button class="el-button--primary" size="small" code="edit" :disabled="editDisabled" @click="goEditMenu">修改菜单</el-button>
        <el-button class="el-button--danger" size="small" code="del" :disabled="editDisabled" @click="deleteMenu">删除菜单</el-button>
      </div>
      <el-dialog
          title="添加菜单"
          :visible.sync="dialogVisible"
          width="40%"
          :before-close="handleClose">
          <el-popover
            ref="popoverTree"
            placement="bottom-start"
            title="菜单列表"
            width="400"
            trigger="click">
            <el-tree
              :data="treeMenu"
              ref="treeAdd"
              highlight-current
              :props="defaultProps"
              :expand-on-click-node='false'
              :check-strictly='true'
              @node-click="addSelectParentMenu">
            </el-tree>
          </el-popover>
          <el-form ref="addForm" :model="addForm" :rules="addRules" label-width="85px">
            <el-form-item label="菜单名" prop="menuName">
              <el-input v-model="addForm.menuName"></el-input>
            </el-form-item>
            <el-form-item label="父菜单" prop="parentMenu">
              <el-input v-popover:popoverTree readonly v-model="addForm.parentMenu"></el-input>
            </el-form-item>
            <el-form-item label="菜单地址" prop="menuAddr">
              <el-input v-model="addForm.menuAddr"></el-input>
            </el-form-item>
            <el-form-item label="菜单类型" prop="menuType">
              <el-select v-model="addForm.menuType" @change="addMenuTypeChange" placeholder="请选择">
                <el-option label="菜单" :value="1" :key="1"></el-option>
                <el-option label="按钮" :value="2" :key="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="菜单图标" prop="menuIcon" v-show="addForm.menuType == 1">
              <el-input v-model="addForm.menuIcon"></el-input>
            </el-form-item>
            <el-form-item label="按钮code" prop="menuCode" v-show="addForm.menuType == 2">
              <el-input v-model="addForm.menuCode"></el-input>
            </el-form-item>
            <el-form-item label="菜单顺序" prop="menuOrder">
              <el-input v-model="addForm.menuOrder"></el-input>
            </el-form-item>
            <el-form-item class="btn_box">
              <el-button type="primary" @click="submitForm('addForm')">保存</el-button>
              <el-button @click="resetForm('addForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      <el-col :span="6">
        <h4 style="margin-top: 0;color:#606266">菜单列表</h4>
        <el-tree
          :data="treeMenu"
          node-key="id"
          ref="treeMenu"
          highlight-current
          default-expand-all
          :expand-on-click-node="false"
          :props="defaultProps"
          @node-click="getCurrentObj">
        </el-tree>
      </el-col>
      <el-col :span="16">
        <el-popover
          ref="popoverTree"
          placement="bottom-start"
          title="菜单列表"
          width="400"
          :disabled="isDisable"
          trigger="click">
          <el-tree
            :data="treeMenu"
            ref="editAdd"
            highlight-current
            :props="defaultProps"
            :expand-on-click-node='false'
            :check-strictly='true'
            @node-click="editSelectParentMenu">
          </el-tree>
        </el-popover>
        <el-form ref="editForm" :model="editForm" :rules="rules" label-width="85px">
          <el-form-item label="菜单名" prop="menuName">
            <el-input :readonly="isReadonly" v-model="editForm.menuName"></el-input>
          </el-form-item>
          <el-form-item label="父菜单" prop="parentMenu">
            <el-input v-model="editForm.parentMenu" readonly v-popover:popoverTree></el-input>
          </el-form-item>
          <el-form-item label="菜单地址" prop="menuAddr">
            <el-input :readonly="isReadonly" v-model="editForm.menuAddr"></el-input>
          </el-form-item>
          <el-form-item label="菜单类型" prop="menuType">
            <el-select :disabled="isReadonly" v-model="editForm.menuType" @change="editMenuTypeChange" placeholder="请选择">
              <el-option label="菜单" :value="1" :key="1"></el-option>
              <el-option label="按钮" :value="2" :key="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="菜单图标" prop="menuIcon" v-show="editForm.menuType == 1">
            <el-input :readonly="isReadonly" v-model="editForm.menuIcon"></el-input>
          </el-form-item>
          <el-form-item label="按钮code" prop="menuCode" v-show="editForm.menuType == 2">
            <el-input :readonly="isReadonly" v-model="editForm.menuCode"></el-input>
          </el-form-item>
          <el-form-item label="菜单顺序" prop="menuOrder">
            <el-input :readonly="isReadonly" v-model="editForm.menuOrder"></el-input>
          </el-form-item>
          <el-form-item class="btn_box" v-show="isBtnShow">
            <el-button type="primary" @click="submitForm('editForm')">保存</el-button>
            <el-button @click="resetForm('editForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { authMenuButton } from '@/utils/authMenuButton'
  import { treeFunction, getFunctionById, removeFunction, addFunction, updateFunction } from '@/api/function'
  export default {
    name: 'mainMenu',
    data() {
      return {
        treeMenu: null,
        isDisable: true,
        currentId: null,
        parentId: null,
        parentMenuId: null,
        isReadonly: true,
        dialogVisible: false,
        isBtnShow: false,
        editDisabled: false,
        editForm: {
          menuName: '',
          parentMenu: '',
          menuAddr: '',
          menuType: '',
          menuIcon: '',
          menuCode: '',
          menuOrder: ''
        },
        addForm: {
          menuName: '',
          parentMenu: '',
          menuAddr: '',
          menuType: '',
          menuIcon: '',
          menuCode: '',
          menuOrder: ''
        },
        rules: {},
        addRules: {
          menuName: [
            { required: true, message: '请输入菜单名称', trigger: 'blur' }
          ],
          parentMenu: [
            { required: true, message: '请选择父菜单', trigger: 'change' }
          ],
          menuType: [
            { required: true, message: '请选择菜单类型', trigger: 'change' }
          ],
          menuIcon: [],
          menuCode: [],
          menuOrder: [
            { required: true, message: '请输入菜单顺序', trigger: 'blur' },
            { pattern: /^[0-9]*$/, message: '请输入纯数字', trigger: 'blur' }
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
      this.fetchData()
    },
    methods: {
      /* 初始化菜单树 */
      fetchData() {
        treeFunction().then(response => {
          this.treeMenu = response.data.data
        })
      },
      /* 获取菜单树当前点击节点及父节点 */
      getCurrentObj(obj, node) {
        if (obj.id === 1) {
          this.editDisabled = true
        } else {
          this.editDisabled = false
        }
        if (this.isBtnShow) {
          this.$confirm('尚未保存修改，要放弃修改吗？', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.isReadonly = true
            this.isBtnShow = false
            this.handleRules()
          }).catch(() => {
            return
          })
        }
        this.currentId = obj.id
        this.parentId = node.parent.data.id
        this.$refs['editForm'].resetFields()
        getFunctionById(this.currentId).then(response => {
          this.editForm.menuName = response.data.data.functionName
          this.editForm.parentMenu = node.parent.data.label || '无'
          this.editForm.menuAddr = response.data.data.functionUrl
          this.editForm.menuType = response.data.data.functionType
          this.editForm.menuIcon = response.data.data.iconStyle
          this.editForm.menuCode = response.data.data.functionCode
          this.editForm.menuOrder = response.data.data.functionSort
        })
      },
      /* 打开添加菜单 */
      goAddMenu() {
        this.dialogVisible = true
      },
      /* 打开修改菜单 */
      goEditMenu() {
        if (!this.currentId) {
          this.$message({
            type: 'warning',
            message: '请在左侧菜单列表中选一行再执行此操作',
            duration: '2000'
          })
          return
        }
        this.isReadonly = false
        this.isBtnShow = true
        this.isDisable = false
        this.handleRules()
      },
      /* 删除菜单 */
      deleteMenu() {
        if (!this.currentId) {
          this.$message({
            type: 'warning',
            message: '请在左侧菜单列表中选一行再执行此操作',
            duration: '2000'
          })
          return
        }
        this.$confirm('此操作将永久删除该菜单，是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeFunction(this.currentId).then(response => {
            this.$message({
              type: 'success',
              message: '删除成功',
              duration: 2000,
              onClose: () => {
                this.fetchData()
              }
            })
          })
        })
      },
      /* 添加选择父菜单 */
      addSelectParentMenu(node) {
        this.parentMenuId = node.id
        this.addForm.parentMenu = node.label
      },
      /* 修改选择父菜单 */
      editSelectParentMenu(node) {
        this.parentMenuId = node.id
        this.editForm.parentMenu = node.label
      },
      /* 添加修改表单提交 */
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            if (formName === 'addForm') {
              addFunction(
                this.addForm.menuName,
                this.parentMenuId,
                this.addForm.menuAddr,
                parseInt(this.addForm.menuType),
                this.addForm.menuIcon,
                this.addForm.menuCode,
                this.addForm.menuOrder
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '添加成功!',
                  duration: 1500,
                  onClose: () => {
                    this.fetchData()
                    this.$refs[formName].resetFields()
                    this.dialogVisible = false
                  }
                })
              })
            } else if (formName === 'editForm') {
              updateFunction(
                this.currentId,
                this.editForm.menuName,
                this.parentMenuId,
                this.editForm.menuAddr,
                parseInt(this.editForm.menuType),
                this.editForm.menuIcon,
                this.editForm.menuCode,
                this.editForm.menuOrder
              ).then(() => {
                this.$message({
                  type: 'success',
                  message: '修改成功!',
                  duration: 1500,
                  onClose: () => {
                    this.fetchData()
                    this.$refs[formName].resetFields()
                    this.editDialogVisible = false
                    this.isBtnShow = false
                    this.isReadonly = true
                    this.isDisable = true
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
        }).catch(() => {
        })
      },
      /* 添加时 菜单类型的选择所触发的事件 */
      addMenuTypeChange(val) {
        if (val === 1) {
          this.addRules.menuCode = []
          this.addRules.menuIcon = [
            { required: true, message: '请输入菜单图标', trigger: 'blur' }
          ]
        } else {
          this.addRules.menuIcon = []
          this.addRules.menuCode = [
            { required: true, message: '请输入按钮code', trigger: 'blur' }
          ]
        }
      },
      /* 修改时 菜单类型的选择所触发的事件 */
      editMenuTypeChange(val) {
        if (val === 1) {
          this.rules.menuCode = []
          this.rules.menuIcon = [
            { required: true, message: '请输入菜单图标', trigger: 'blur' }
          ]
        } else {
          this.rules.menuIcon = []
          this.rules.menuCode = [
            { required: true, message: '请输入按钮code', trigger: 'blur' }
          ]
        }
      },
      /* 只读状态下不显示验证 */
      handleRules() {
        if (!this.isReadonly) {
          this.rules = {
            menuName: [
              { required: true, message: '请输入菜单名称', trigger: 'blur' }
            ],
            parentMenu: [
              { required: true, message: '请选择父菜单', trigger: 'change' }
            ],
            menuType: [
              { required: true, message: '请选择菜单类型', trigger: 'change' }
            ],
            menuIcon: [],
            menuCode: [],
            menuOrder: [
              { required: true, message: '请输入菜单顺序', trigger: 'blur' },
              { pattern: /^[0-9]*$/, message: '请输入纯数字', trigger: 'blur' }
            ]
          }
        } else {
          this.rules = {}
        }
      }
    }
  }
</script>

<style scoped>
</style>
