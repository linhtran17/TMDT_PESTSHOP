// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import Notifications from '@kyvg/vue3-notification'


import { formatCurrency, formatDate, formatDateTime, formatVND } from '@/utils'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'

import GoogleSignInPlugin from 'vue3-google-signin'
import { useAuth } from '@/stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(router).use(pinia).use(Notifications)

// Bật Google Sign-In nếu có CLIENT ID
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
if (clientId) {
  app.use(GoogleSignInPlugin, { clientId })
} else {
  console.warn('[GoogleSignIn] VITE_GOOGLE_CLIENT_ID is missing → Google login disabled.')
}

 window.__router__ = router
// chỉ gọi /auth/me nếu đã có token
useAuth().bootstrap()
app.mixin({
  methods: { formatCurrency, formatDate, formatDateTime, formatVND }
})
app.config.globalProperties.$formatCurrency = formatCurrency; // opt

// optional: log error global
app.config.errorHandler = (err, vm, info) => {
  console.error('[Vue errorHandler]', err, info)
}

app.mount('#app')
