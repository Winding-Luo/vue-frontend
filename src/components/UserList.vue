<template>
  <div>
    <h2>用户列表 (受保护)</h2>
    <p v-if="error" class="error">{{ error }}</p>
    <ul>
      <li v-for="user in users" :key="user.id">
        ID: {{ user.id }} | 用户名: {{ user.username }} | 邮箱: {{ user.email }}
        <button @click="deleteUser(user.id)">删除 (需要Admin权限)</button>
      </li>
    </ul>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'UserList',
  data() {
    return {
      users: [],
      error: ''
    };
  },
  async created() {
    // 组件创建时获取用户列表
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await api.getAllUsers();
        this.users = response.data;
      } catch (error) {
        // 401 错误会被 main.js 拦截器处理并跳转到登录
        // 我们在这里捕获其他错误
        console.error("获取用户列表失败:", error);
        this.error = '无法加载用户列表。';
      }
    },
    
    async deleteUser(id) {
      if (!confirm('确定要删除这个用户吗？此操作需要管理员权限。')) {
        return;
      }

      try {
        // 1. 尝试删除
        await api.deleteUser(id);
        
        // 2. 删除成功, 重新加载列表
        alert('用户删除成功！');
        await this.fetchUsers(); // 重新获取数据

      } catch (error) {
        // 3. 删除失败
        // 如果是 403 权限不足, main.js 中的拦截器会弹窗 alert
        // 如果是 401 Session 过期, 拦截器会跳转到登录页
        console.error('删除操作被拦截或发生错误', error);
      }
    }
  }
};
</script>

<style scoped>
.error {
  color: red;
}
li {
  list-style: none;
  margin: 10px 0;
  padding: 5px;
  border: 1px solid #eee;
}
</style>