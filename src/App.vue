<template>
  <div id="app">
    <nav v-if="isLoggedIn" class="navbar">
      <span>你好, {{ userName }}</span>
      <router-link to="/users">用户列表</router-link>
      <button @click="handleLogout">登出</button>
    </nav>
    <nav v-else class="navbar">
      <router-link to="/login">登录</router-link>
      <router-link to="/register">注册</router-link>
    </nav>
    <hr>
    <router-view />
  </div>
</template>

<script>
// 唯一需要的导入
import api from './api';

// (这里不再需要 import computed, useStore, useRouter, useRoute)

export default {
  name: 'App',
  
  // Options API 使用 computed 关键字
  computed: {
    // 检查用户是否登录 (通过 sessionStorage)
    isLoggedIn() {
      // 访问 $route 可以确保在路由变化时这个计算属性也能重新计算
      this.$route.path; 
      return !!sessionStorage.getItem('user');
    },
    // 获取用户名
    userName() {
      if (this.isLoggedIn) {
        try {
          const user = JSON.parse(sessionStorage.getItem('user'));
          return user.username;
        } catch (e) {
          return '';
        }
      }
      return '';
    }
  },
  
  // Options API 使用 methods 关键字
  methods: {
    async handleLogout() {
      try {
        await api.logout();
      } catch (error) {
        // 即使登出失败 (例如 session 已过期)，
        // 我们也要清理前端
        console.error('登出失败:', error);
      } finally {
        // !!关键!!: 无论成功与否, 都清除本地存储并跳转到登录页
        sessionStorage.removeItem('user');
        // 在 Options API 中使用 this.$router
        this.$router.push('/login');
      }
    }
  }
};
</script>

<style>
/* (您的全局样式) */
.navbar {
  padding: 10px;
  background-color: #f0f0f0;
  display: flex;
  gap: 15px; /* 增加间距 */
  align-items: center;
}
</style>