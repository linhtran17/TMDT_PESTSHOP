import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/main.css'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import Notifications from '@kyvg/vue3-notification'
import GoogleSignInPlugin from "vue3-google-signin"

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import moment from 'moment'

import App from './App.vue'
import router from './router'
import "@/components/index"


const gAuthOptions = { clientId: '205292167077-8vg46506fa2k1n8npbjtfr3t00em42fc.apps.googleusercontent.com', scope: 'profile email' };

const app = createApp(App)
app.use(GoogleSignInPlugin, gAuthOptions)
// Cài đặt các plugin
app.use(BootstrapVue)
app.use(IconsPlugin)
app.use(Notifications)

app.use(createPinia())
app.use(router)
// // Khôi phục trạng thái đăng nhập
// const auth = useAuth();
// auth.restoreSession().then(() => {
//   console.log('Ứng dụng đã khởi động với trạng thái auth:', auth.user, auth.token);
//   app.mount('#app');
// });

// Thêm phương thức formatCurrency toàn cục
app.config.globalProperties.formatCurrency = function formatCurrency(price) {
    if (price) {
        return new Intl.NumberFormat('vi-VN', { maximumSignificantDigits: 3 }).format(price)
    }
    return price
}

// Thêm phương thức formatDate toàn cục
app.config.globalProperties.formatDate = function formatDate(valString) {
    if (valString) {
        return moment(valString).format("HH:mm DD/MM/YYYY")
    }
    return ""
}

// Khởi tạo ứng dụng Vue
app.mount('#app')

// Nhúng các script của Bootstrap
import "bootstrap/dist/js/bootstrap.js"
