<template>
  <div class="admin-dashboard">
    <!-- 顶部导航栏 -->
    <div class="header">
      <div class="header-left">
        <h2>农事服务中心 - 后台管理</h2>
      </div>
      <div class="header-right">
        <span class="welcome">欢迎，管理员</span>
        <el-button type="danger" size="small" @click="logout">退出登录</el-button>
      </div>
    </div>

    <!-- 主体内容 -->
    <div class="main-content">
      <!-- 侧边栏 -->
      <div class="sidebar">
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          background-color="#304156"
          text-color="#bfcbd9"
          active-text-color="#409EFF"
          @select="handleMenuSelect"
        >
          <el-menu-item index="orders">
            <i class="el-icon-s-order"></i>
            <span slot="title">订单管理</span>
          </el-menu-item>
          <el-menu-item index="settings">
            <i class="el-icon-setting"></i>
            <span slot="title">系统配置</span>
          </el-menu-item>
          <el-menu-item index="comments">
            <i class="el-icon-chat-dot-round"></i>
            <span slot="title">评论管理</span>
          </el-menu-item>
          <el-menu-item index="suggestions">
            <i class="el-icon-s-comment"></i>
            <span slot="title">意见咨询</span>
          </el-menu-item>
          <el-menu-item index="promotions">
            <i class="el-icon-news"></i>
            <span slot="title">推广资讯</span>
          </el-menu-item>
          <el-menu-item index="delivery">
            <i class="el-icon-truck"></i>
            <span slot="title">农资配送</span>
          </el-menu-item>
        </el-menu>
      </div>

      <!-- 右侧内容区域 -->
      <div class="content-area">
        <!-- 订单管理 -->
        <OrdersManagement v-if="activeMenu === 'orders'" />
        
        <!-- 系统配置 -->
        <SettingsManagement v-else-if="activeMenu === 'settings'" />
        
        <!-- 评论管理 -->
        <CommentsManagement v-else-if="activeMenu === 'comments'" />

        <!-- 意见咨询管理 -->
        <SuggestionsManagement v-else-if="activeMenu === 'suggestions'" />

        <!-- 推广资讯管理 -->
        <PromotionsManagement v-else-if="activeMenu === 'promotions'" />

        <!-- 农资配送管理 -->
        <DeliveryManagement v-else-if="activeMenu === 'delivery'" />
      </div>
    </div>


  </div>
</template>

<script>

import OrdersManagement from './admin/OrdersManagement.vue'
import CommentsManagement from './admin/CommentsManagement.vue'
import SettingsManagement from './admin/SettingsManagement.vue'
import SuggestionsManagement from './admin/SuggestionsManagement.vue'
import PromotionsManagement from './admin/PromotionsManagement.vue'
import DeliveryManagement from './admin/DeliveryManagement.vue'

export default {
  components: {
    OrdersManagement,
    CommentsManagement,
    SettingsManagement,
    SuggestionsManagement,
    PromotionsManagement,
    DeliveryManagement
  },
  name: 'AdminDashboard',
  data() {
    return {
      activeMenu: 'orders'
    }
  },
  mounted() {
    this.checkAuth();
  },
  methods: {
    // 检查登录状态
    checkAuth() {
      const token = localStorage.getItem('adminToken');
      if (token !== 'ADMIN_TOKEN_2024_NONGYE_CENTER') {
        this.$message.error('当前未登录，请先登录！');
        this.$router.push('/admin');
        return;
      }
    },
    
    // 退出登录
    logout() {
      this.$confirm('确认退出登录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('adminToken');
        this.$message.success('已退出登录');
        this.$router.push('/admin');
      }).catch(() => {
        // 用户取消
      });
    },

    // 菜单选择
    handleMenuSelect(key) {
      this.activeMenu = key;
    },
  }
}
</script>

<style lang="scss" scoped>
.admin-dashboard {
  min-height: 100vh;
  background: #f0f2f5;
}

.header {
  background: #fff;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 10;

  .header-left h2 {
    margin: 0;
    color: #333;
    font-size: 20px;
    font-weight: 600;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .welcome {
      color: #666;
      font-size: 14px;
    }
  }
}

.main-content {
  display: flex;
  height: calc(100vh - 64px);
}

.sidebar {
  width: 240px;
  background: #304156;

  .sidebar-menu {
    border-right: none;
    height: 100%;

    .el-menu-item {
      height: 50px;
      line-height: 50px;

      i {
        margin-right: 8px;
      }
    }
  }
}

.content-area {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e8e8e8;

  h3 {
    margin: 0;
    font-size: 20px;
    color: #333;
  }
}

.filter-section {
  background: #fff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;

  .filter-form {
    margin: 0;
  }
}



.pagination-container {
  margin-top: 16px;
  text-align: right;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  p {
    margin-top: 16px;
    color: #999;
    font-size: 16px;
  }
}
</style> 

