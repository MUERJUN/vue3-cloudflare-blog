// 字体：JetBrains Mono 拉丁子集（本地打包；中文走系统字体）
import '@fontsource/jetbrains-mono/latin-400.css';
import '@fontsource/jetbrains-mono/latin-500.css';
import '@fontsource/jetbrains-mono/latin-600.css';
import '@fontsource/jetbrains-mono/latin-700.css';

import { createApp } from 'vue'
import App from './App.vue'
import './style.css'
import { getTheme, applyTheme } from './lib/theme.js'

// 渲染前应用主题，避免闪烁
applyTheme(getTheme())

createApp(App).mount('#app')