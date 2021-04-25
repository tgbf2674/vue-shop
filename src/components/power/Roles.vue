<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片试图  -->
    <el-card>
      <!--   添加角色按钮区域   -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="AddRoleDialogVisible= true">添加角色</el-button>
        </el-col>
      </el-row>
      <!--   角色列表区域   -->
      <el-table :data="roleList" border stripe>
        <!--    展开列    -->
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id"
                    :class="['bdbottom', i1 ===0? 'bdtop' : '', 'vcenter']">
              <!--      一级权限        -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">
                  {{ item1.authName }}
                  <i class="el-icon-caret-right"></i>
                </el-tag>
              </el-col>
              <!--      二级，三级权限        -->
              <el-col :span="19">
                <!--       t通过for循坏 嵌套渲染二级权限         -->
                <el-row :class="['bdtop', i2 === 0 ?'' : 'bdtop' , 'vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag closable @close="removeRightById(scope.row, item2.id)" type="success">
                      {{ item2.authName }}
                      <i class="el-icon-caret-right"></i>
                    </el-tag>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable @close="removeRightById(scope.row, item3.id)" type="warning" v-for="(item3,i3) in item2.children" :key="item3.id" :class="['bdtop',i3===0 ? '' : 'bdtop' ]">
                      {{item3.authName}}
                      <i class="el-icon-caret-right"></i>
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!--    索引列    -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="roleDesc" width="300px">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑
            </el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除
            </el-button>
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--  添加用户的对话框  -->
    <el-dialog title="添加角色" :visible.sync="AddRoleDialogVisible" width="40%" @close="addRoleDialogClosed">
      <el-form
        :model="addRoleForm"
        ref="addRoleFormRef"
        :rules="addRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="AddRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </span>
    </el-dialog>

    <!--  修改用户的对话框  -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="40%" @close="editRoleDialogClosed">
      <el-form
        :model="editRoleForm"
        ref="editRoleFormRef"
        :rules="editRoleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </span>
    </el-dialog>
<!--  分配权限的对话框  -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%" @close="setRightDialogClosed">
      <el-tree ref="treeRef" :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      /* 所有角色的列表 */
      roleList: [],
      AddRoleDialogVisible: false,
      addRoleForm: {},
      editRoleForm: {},
      // 默认选中的节点Id 数组
      defKeys: [],
      editRoleDialogVisible: false,
      setRightDialogVisible: false,
      roleId: '',
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      rightsList: [],
      addRoleFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          }
        ]
      },
      editRoleFormRules: {
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          }
        ],
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.getRolesList()
  },
  methods: {
    /* 获取角色的列表 */
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户角色列表')
      }
      this.roleList = res.data
    },
    addRoleDialogClosed () {
      this.$nextTick(() => {
        this.$refs.addRoleFormRef.resetFields()
      })
    },
    editRoleDialogClosed () {
      this.$refs.editRoleFormRef.resetFields()
    },
    /* 添加角色 */
    addRoles () {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) { return null }
        /* 可以发起添加用户的请求 */
        const { data: res } = await this.$http.post('roles', this.addRoleForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }
        this.$message.success('添加用户成功！')
        this.addDialogVisible = false
        await this.getRolesList()
      })
    },
    /* 修改角色 */
    async showEditDialog (id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询角色信息失败！')
      this.editRoleForm = res.data
      this.editRoleDialogVisible = true
    },
    editRoles () {
      this.$refs.editRoleFormRef.validate(async valid => {
        const { data: res } = await this.$http.put('roles/' + this.editRoleForm.roleId, {
          roleName: this.editRoleForm.roleName,
          roleDesc: this.editRoleForm.roleDesc
        })
        if (res.meta.status !== 200) {
          this.$message.error('更新角色信息失败')
        }
        // 隐藏编辑角色对话框
        this.editRoleDialogVisible = false
        this.$message.success('更新角色信息成功！')
        await this.getRolesList()
      })
    },
    /* 删除角色 */
    async removeRoleById (id) {
      /* 弹框提示 */
      const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      /* 如果用户确认删除，返回confirm */
      /* 如果用户取消了删除，返回cancel */
      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      await this.getRolesList()
    },
    /* 根据Id删除对应的权限 */
    async removeRightById (role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除权限失败')
      }
      role.children = res.data
    },
    /* 展示分配权限的对话框 */
    async showSetRightDialog (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限数据失败')
      }
      // 获取到的权限数据保存到data 中
      this.rightsList = res.data
      /* 递归获取三级节点的id */
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    /* 通过递归的形式，获取角色下所有三级权限的id，并保存到defKeys中 */
    getLeafKeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 对话框关闭清空数组
    setRightDialogClosed () {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights () {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      await this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbottom {
  border-bottom: 1px solid #eeeeee;
}

.vcenter{
  display: flex;
  align-items: center;
}
</style>
