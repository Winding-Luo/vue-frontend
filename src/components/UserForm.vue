<template>
  <div>
    <h2 v-if="isEditMode">编辑用户 (ID: {{ id }})</h2>
    <h2 v-else>创建新用户</h2>
    
    <form @submit.prevent="handleSubmit">
      <div>
        <label>用户名:</label>
        <input v-model="user.username" type="text" required />
      </div>
      <div>
        <label>邮箱:</label>
        <input v-model="user.email" type="email" required />
      </div>
      <div>
        <label>密码:</label>
        <input v-model="user.password" type="password" :placeholder="isEditMode ? '(留空则不修改)' : ''" :required="!isEditMode" />
      </div>
      <button type="submit">保存</button>
      <p v-if="error" style="color: red;">{{ error }}</p>
    </form>
  </div>
</template>

<script>
import api from '../api';

export default {
  name: 'UserForm',
  // 接收来自路由的 id 参数
  props: ['id'], 
  data() {
    return {
      user: {
        username: '',
        email: '',
        password: '' // 密码默认为空
      },
      error: null
    };
  },
  computed: {
    // 计算属性，判断当前是编辑还是新增
    isEditMode() {
      return !!this.id; // 如果 this.id 存在，则为 true
    }
  },
  created() {
    // 如果是编辑模式 (isEditMode 为 true)，则加载现有用户数据
    if (this.isEditMode) {
      this.fetchUserData();
    }
    // 如果是新增模式，user 对象保持默认空值
  },
  methods: {
    fetchUserData() {
      api.getUserById(this.id)
        .then(response => {
          // 只设置需要编辑的字段，密码留空
          this.user.username = response.data.username;
          this.user.email = response.data.email;
        })
        .catch(error => {
          console.error('获取用户信息失败:', error);
          this.error = '无法加载用户数据。';
        });
    },
    handleSubmit() {
      this.error = null;
      let apiCall;

      // 准备要提交的数据
      const userData = {
        username: this.user.username,
        email: this.user.email
      };

      if (this.isEditMode) {
        // 编辑模式
        // 如果输入了密码，才将其包含在请求中
        if (this.user.password) {
          userData.password = this.user.password;
        }
        apiCall = api.updateUser(this.id, userData);
      } else {
        // 新增模式
        userData.password = this.user.password;
        apiCall = api.registerUser(userData);
      }

      // 执行 API 调用
      apiCall
        .then(response => {
          const newId = response.data.id;
          alert('保存成功!');
          // 保存成功后，跳转到该用户的详情页
          this.$router.push({ name: 'UserDetail', params: { id: this.id || newId } });
        })
        .catch(error => {
          console.error('保存失败:', error);
          this.error = '保存失败。';
        });
    }
  }
}
</script>