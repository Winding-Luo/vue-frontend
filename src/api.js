import axios from 'axios';

// 基础路径，通过 proxy 转发
axios.defaults.baseURL = '/api'; 
// 允许携带 Cookie (Session)
axios.defaults.withCredentials = true;

export default {
  login(username, password) {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);
    return axios.post('/users/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },
  logout() {
    return axios.post('/users/logout');
  },
  getAllUsers() {
    return axios.get('/users');
  },
  getUserById(id) {
    return axios.get(`/users/${id}`);
  },
  deleteUser(id) {
    return axios.delete(`/users/${id}`);
  },
  registerUser(user) {
    return axios.post('/users/register', user);
  },
  updateUser(id, user) {
    return axios.put(`/users/${id}`, user);
  }
};