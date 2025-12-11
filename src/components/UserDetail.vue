<template>
  <div>
    <h2>用户详情</h2>
    <div v-if="loading">正在加载...</div>
    <div v-if="error" style="color: red;">{{ error }}</div>
    
    <div v-if="user">
      <p><strong>ID:</strong> {{ user.id }}</p>
      <p><strong>用户名:</strong> {{ user.username }}</p>
      <p><strong>邮箱:</strong> {{ user.email }}</p>
      
      <br>
      <router-link :to="{ name: 'UserEdit', params: { id: user.id } }">编辑此用户</router-link>
      <br>
      <router-link to="/">返回列表</router-link>
    </div>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'UserDetail',
  props: ['id'], // 接收来自路由的 id
  data() {
    return {
      user: null,
      loading: false,
      error: null
    };
  },
  created() {
    this.fetchUser();
  },
  methods: {
    fetchUser() {
      this.loading = true;
      this.error = null;
      
      api.getUserById(this.id)
        .then(response => {
          this.user = response.data;
          this.loading = false;
        })
        .catch(error => {
          console.error('获取用户详情失败:', error);
          this.error = '无法加载用户。';
          this.loading = false;
        });
    }
  }
}
</script>