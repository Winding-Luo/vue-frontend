// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import UserList from '../components/UserList.vue';
import UserForm from '../components/UserForm.vue';
// 1. !!关键!!: 取消注释 UserDetail 的导入
import UserDetail from '../components/UserDetail.vue';

const routes = [
  {
    path: '/',
    redirect: '/users'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: UserForm
  },
  {
    path: '/users',
    name: 'UserList',
    component: UserList,
    meta: { requiresAuth: true }
  },
  
  // 2. !!关键!!: 添加 UserDetail 路由，解决保存后的跳转错误
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: UserDetail,
    // 开启 props: true，这样组件可以用 props: ['id'] 接收参数
    props: true, 
    meta: { requiresAuth: true }
  },

  // 3. (建议补充) 添加 UserEdit 路由，复用 UserForm 组件
  // 这样 UserDetail 页面里的 "编辑此用户" 链接才能正常工作
  {
    path: '/users/edit/:id',
    name: 'UserEdit',
    component: UserForm,
    props: true, // 让 UserForm 能够接收 id 参数
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const user = sessionStorage.getItem('user');
  if (to.meta.requiresAuth) {
    if (user) {
      next();
    } else {
      next('/login');
    }
  } else {
    if ((to.name === 'Login' || to.name === 'Register') && user) {
      next('/');
    } else {
      next();
    }
  }
});

export default router;