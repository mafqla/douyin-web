import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// import './assets/main.css'
import '@/assets/styles/main.scss'
// 使用svg
import {SvgIcon, Loading} from '@/components/common'
import 'virtual:svg-icons-register'
//pinia持久化
import piniaPersist from 'pinia-plugin-persist'
//自定义指令
import installDirective from '@/directives'

const app = createApp(App)

const pinia = createPinia()
pinia.use(piniaPersist)
app.use(pinia)
app.use(router)
installDirective(app)

// 全局注册svg-icon
app.component('svg-icon', SvgIcon)
app.component('loading', Loading)
app.mount('#app')
