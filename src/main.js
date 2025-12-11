// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // 导入 router
import axios from 'axios';     // 导入 axios

// !!关键!!: 添加全局 Axios 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 正常响应，直接返回
    return response;
  },
  (error) => {
    // 错误响应
    if (error.response) {
      switch (error.response.status) {
        
        // 401 Unauthorized: Session 过期或未登录
        // Shiro 会重定向到 /api/users/unauthorized，返回 401
        case 401:
          console.error('会话超时或未登录, 跳转到登录页...');
          
          // 清除本地存储的用户信息
          sessionStorage.removeItem('user');
          
          // 跳转到登录页 (避免在拦截器中循环重定向)
          if (router.currentRoute.value.path !== '/login') {
            router.push('/login');
          }
          break;

        // 403 Forbidden: 权限不足
        // Shiro 会重定向到 /api/users/forbidden，返回 403
        case 403:
          console.error('权限不足');
          alert('您没有执行此操作的权限。'); // 给用户一个明确提示
          break;
        
        default:
          // 其他错误 (如 500)
          console.error('发生错误:', error.response.data);
      }
    }
    // 必须返回 Promise.reject 以便 API 调用的 .catch() 可以捕获它
    return Promise.reject(error);
  }
);


const app = createApp(App);
app.use(router);
app.mount('#app');