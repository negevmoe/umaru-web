import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

export default defineConfig({
    server: {
        port: 3000,
        proxy: {
            '/api': {
                target: 'http://localhost:8081',
                changeOrigin: true,
                rewrite: (path) => path
            }
        }
    },
    plugins: [
        vue(),
    ],
    resolve: {
        alias: {
            '@': path.join(__dirname, './src')
        }
    },
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: {
                    hack: `true; @import (reference) "${path.resolve("src/assets/css/base.less")}";`,
                },
                javascriptEnabled: true,
            },
        },
    }
})
