<template>
  <div>
    <!--  面包屑导航区  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--  卡片视图区  -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input clearable @clear="getGoodsList" placeholder="请输入内容" v-model="queryInfo.query">
            <el-button @click="getGoodsList" slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="goAddPage" type="primary">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" width="95px" prop="goods_price"></el-table-column>
        <el-table-column label="商品重量" width="70px" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" width="200px" prop="add_time">
          <template v-slot="scope">{{ scope.row.add_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column width="130px" label="操作">
          <template v-slot="scope">
            <el-button size="mini" icon="el-icon-edit" type="primary"></el-button>
            <el-button @click="removeById(scope.row.goods_id)" size="mini" icon="el-icon-delete"
                       type="danger"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!--   分页区域   -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0
    }
  },
  methods: {
    async getGoodsList () {
      const { data: res } = await this.$http.get('/goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        this.$message.error('获取商品列表失败')
      }
      this.$message.success('获取商品列表成功')
      this.goodsList = res.data.goods
      this.total = res.data.total
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    async removeById (id) {
      const result = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(error => error)
      if (result !== 'confirm') {
        return this.$message.info('已取消伤处')
      }
      const { data: res } = await this.$http.delete(`goods/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      await this.getGoodsList()
    },
    goAddPage () {
      this.$router.push('/goods/add')
    }
  },
  created () {
    this.getGoodsList()
  }
}
</script>

<style lang="scss" scoped>

</style>
