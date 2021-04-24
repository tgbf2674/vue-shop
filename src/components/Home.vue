<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header class="header-container">
      <div class="header-logo">
        <img class="logo" src="../assets/logo.png" alt="">
      </div>
      <span class="title">商城后台管理系统</span>
      <el-button class="logout" type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container class="body-container">
      <!--  侧边栏  -->
      <el-aside :width="isCollapse ? '64px' : '200px'" class="aside-container">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu style="border-right: none" background-color="#545c64" text-color="#fff" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
          <!--      一级菜单        -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!--     一级菜单模板区-->
            <template slot="title">
              <i style="font-size: 20px" :class="iconsList[item.id]"></i>
              <span style="margin-left: 6px">{{ item.authName }}</span>
            </template>
            <!--                二级菜单-->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span> {{ subItem.authName }} </span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--   中间区域   -->
      <el-main class="main-container">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      menuList: [],
      iconsList: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取所有的菜单
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
    },
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="scss" scoped>
.home-container {
  height: 100%;
  width: 100%;
  position: absolute;
}

.header-container {
  height: 60px;
  background-color: #1596db;
  display: flex;
  position: relative;

  .header-logo {
    border: 1px;
    width: 60px;
    height: 60px;
    padding-right: 10px;
    position: relative;
    right: 10px;

    .logo {
      width: 100%;
    }
  }

  .title {
    position: relative;
    margin: auto 0;
    color: #ffffff;
    font-size: 20px;
  }

  .logout {
    box-sizing: border-box;
    margin: 10px 20px;
    position: absolute;
    right: 0;
  }
}

.body-container {
  height: 100%;
  .aside-container{
    background-color: #545c64;
  }
  .main-container {
  }
}
.toggle-button{
  background-color: #0086b3;
  text-align: center;
  cursor: pointer;
  line-height: 24px;
  font-size: 10px;
  color: #ffffff;
  letter-spacing: 0.2em;
}
</style>
