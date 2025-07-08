import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import vueJsx from '@vitejs/plugin-vue-jsx'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [vue(), tailwindcss(), vueJsx()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
})
