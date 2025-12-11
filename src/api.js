// src/api.js
import axios from 'axios';

// 1. 设置基础 URL。
// 由于使用了 vue.config.js 代理，我们只需要请求 /api 即可。
axios.defaults.baseURL = '/api'; 

// 2. !!关键!!: 允许 axios 在跨域请求中发送和接收 Cookie
// 这是 Shiro (Session) 认证工作的核心
axios.defaults.withCredentials = true;

// 3. (确保移除了) 任何 axios.interceptors.request.use 来设置 
// 'Authorization' : 'Bearer ' + token 的代码都必须被删除。


export default {
  /**
   * 登录
   * @param {string} username 
   * @param {string} password 
   */
  login(username, password) {
    // 4. !!关键!!: 您的 Spring MVC @RequestParam 
    // 需要 x-www-form-urlencoded 格式的数据
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    return axios.post('/users/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },

  /**
   * 登出
   */
  logout() {
    // Shiro 的登出端点
    return axios.post('/users/logout');
  },

  /**
   * 获取所有用户
   */
  getAllUsers() {
    return axios.get('/users');
  },
  
  /**
   * 根据 ID 获取用户
   * @param {number} id 
   */
  getUserById(id) {
    return axios.get(`/users/${id}`);
  },

  /**
   * 删除用户 (需要 Admin 权限)
   * @param {number} id 
   */
  deleteUser(id) {
    return axios.delete(`/users/${id}`);
  },

  /**
   * 注册用户
   * @param {object} user 
   */
  registerUser(user) {
    // 注册接口 (POST /api/users/register) 接收的是 JSON
    return axios.post('/users/register', user);
  }

  // ... (您可以添加其他 API, 如 updateUser)
};