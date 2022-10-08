const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: [
    'vuetify'
  ],
  devServer: {
    proxy: {
      '^/api': {
        target: process.env.BACKEND_API_BASE_URL,
        changeOrigin: true
      }
    }
  }
})
