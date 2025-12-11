// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import UserList from '../components/UserList.vue';
import UserForm from '../components/UserForm.vue'; // 假设您有注册/编辑表单
// import UserDetail from '../components/UserDetail.vue';

const routes = [
  {
    path: '/',
    redirect: '/users' // 默认重定向到用户列表
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register', // 注册页
    name: 'Register',
    component: UserForm 
  },
  {
    path: '/users',
    name: 'UserList',
    component: UserList,
    meta: { requiresAuth: true } // 标记这个路由需要认证
  },
  // {
  //   path: '/users/:id',
  //   name: 'UserDetail',
  //   component: UserDetail,
  //   meta: { requiresAuth: true }
  // },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// !!关键!!: 全局路由守卫
router.beforeEach((to, from, next) => {
  // 1. 尝试从 sessionStorage 获取用户信息
  const user = sessionStorage.getItem('user');

  // 2. 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    if (user) {
      // 用户已登录 (Session 中有用户信息), 允许访问
      next();
    } else {
      // 用户未登录, 重定向到登录页
      next('/login');
    }
  } else {
    // 路由不需要认证 (例如登录页 /login, 注册页 /register)
    
    // (可选) 如果用户已登录，并且访问的是登录页/注册页，则重定向到首页
    if ((to.name === 'Login' || to.name === 'Register') && user) {
      next('/');
    } else {
      // 否则，正常访问
      next();
    }
  }
});

export default router;