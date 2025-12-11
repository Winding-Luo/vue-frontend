const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        // 请确保 Tomcat 启动后，这个地址能访问到后端
        target: 'http://localhost:8080/OnlineEducationPlatform',
        changeOrigin: true,
        // 这里不需要 pathRewrite，因为后端 Controller 就是 /api 开头
      }
    }
  }
});