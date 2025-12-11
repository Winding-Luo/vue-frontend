// vue.config.js (最终修正版)
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        // 目标必须是 Tomcat (8080) 加上您截图中显示的 "Application context"
        target: 'http://localhost:8080/OnlineEducationPlatform/OnlineEducationPlatform_war_exploded',
        
        changeOrigin: true,
        // (我们不需要 pathRewrite，因为后端 API 已经是 /api/users 了)
      }
    }
  }
});