<template>
  <div class="login-container">
    <h2>用户登录</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label for="username">用户名:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div>
        <label for="password">密码:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit">登录</button>
      <p v-if="errorMsg" class="error">{{ errorMsg }}</p>
    </form>
    <router-link to="/register">没有账户？去注册</router-link>
  </div>
</template>

<script>
import api from '../api'; // 导入修改后的 api.js

export default {
  name: 'UserLogin',
  data() {
    return {
      username: '',
      password: '',
      errorMsg: ''
    };
  },
  methods: {
    async handleLogin() {
      this.errorMsg = ''; // 清空之前的错误
      try {
        // 1. 调用新的 API 方法
        const response = await api.login(this.username, this.password);

        // 2. 登录成功, 后端返回了 User 对象 (密码被 @JsonIgnore)
        const user = response.data;

        // 3. !!关键!!: 将 User 对象 (JSON 字符串) 存入 sessionStorage
        // 使用 sessionStorage，浏览器关闭即失效，符合 Shiro Session 的特性
        sessionStorage.setItem('user', JSON.stringify(user));

        // 4. 跳转到首页或用户列表页
        this.$router.push('/');

      } catch (error) {
        // 5. 处理登录失败 (由 Shiro 返回的 401)
        if (error.response && error.response.status === 401) {
          // 这个错误在 main.js 拦截器中被捕获并跳转
          // 但 .catch 仍然会执行
          this.errorMsg = '用户名或密码错误。';
        } else {
          // 其他错误 (例如网络问题)
          this.errorMsg = '登录时发生未知错误。';
          console.error(error);
        }
      }
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
.login-container {
  max-width: 300px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>