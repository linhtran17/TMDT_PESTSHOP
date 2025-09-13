// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/home/HomeView.vue'
import AdminPets from '@/views/admin/product-admin/ProductList.vue'
import AdminPetForm from '@/views/admin/product-admin/ProductForm.vue'
import AdminNews from '@/views/admin/new-admin/NewList.vue'
import AdminNewsForm from '@/views/admin/new-admin/NewForm.vue'
import { metas } from '@/utils'
import { useAuth } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },

    { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
    { path: '/my-order', name: 'my-order', component: () => import('@/views/MyOrder.vue') },
    { path: '/pay-status', name: 'pay-status', component: () => import('@/views/PayStatus.vue') },

    { path: '/dogs', name: 'dogs', component: () => import('@/views/product/Dogs.vue') },
    { path: '/cats', name: 'cats', component: () => import('@/views/product/Cats.vue') },
    { path: '/product/:id', name: 'product-detail', component: () => import('@/views/product/PetDetail.vue') },

    { path: '/login', name: 'login', meta: { layout: 'auth' }, component: () => import('@/views/auth/LoginForm.vue') },
    { path: '/sign-up', name: 'signup', meta: { layout: 'auth' }, component: () => import('@/views/auth/Signup.vue') },

    { path: '/profile', name: 'profile', component: () => import('@/views/auth/profile/hoso.vue') },
    { path: '/purchases', name: 'purchases', component: () => import('@/views/auth/profile/Shipper.vue') },
    { path: '/address', name: 'address', component: () => import('@/views/auth/profile/Adress.vue') },
    { path: '/changePass', name: 'changePass', component: () => import('@/views/auth/profile/ChangePass.vue') },
    { path: '/notification', name: 'notification', component: () => import('@/views/auth/profile/Notification.vue') },
    { path: '/product-vouchers', name: 'vouchers', component: () => import('@/views/auth/profile/Voucher.vue') },
    { path: '/evaluate', name: 'Danhgia', component: () => import('@/views/auth/profile/Danhgia.vue') },

    { path: '/intro', name: 'intro', component: () => import('@/views/Intro.vue') },
    { path: '/search-product', name: 'search-product', component: () => import('@/components/SearchProduct.vue') },

    { path: '/news', name: 'news', component: () => import('@/views/News.vue') },
    { path: '/news/:id', name: 'news-detail', component: () => import('@/views/NewsDetail.vue'), props: true },

    { path: '/contact', name: 'contact', component: () => import('@/views/Contact.vue') },

    {
      path: '/admin',
      name: 'admin',
      meta: { layout: 'admin', requiresAuth: true, roles: ['admin'] },
      component: () => import('@/views/admin/AdminLayout.vue'),
      children: [
        { path: '', name: 'dashboard', meta: metas.dashboard, component: () => import('@/views/admin/dashboard/Dashboard.vue') },

        // products
        { path: 'products', name: 'admin-products', meta: metas.product, component: AdminPets },
        { path: 'product-add', name: 'product-add', meta: metas.product, component: AdminPetForm },
        { path: 'product-edit/:id', name: 'product-edit', meta: metas.product, component: AdminPetForm },

        // category pet
        { path: 'cat-pets', name: 'cat-pets', meta: metas.catPets, component: () => import('@/views/admin/category-pet/List.vue') },
        { path: 'cat-pet-add', name: 'cat-pet-add', meta: metas.catPets, component: () => import('@/views/admin/category-pet/Form.vue') },
        { path: 'cat-pet-edit/:id', name: 'cat-pet-edit', meta: metas.catPets, component: () => import('@/views/admin/category-pet/Form.vue') },

        // category products
        { path: 'cat-pro', name: 'cat-pro', meta: metas.catPro, component: () => import('@/views/admin/category-products/List.vue') },
        { path: 'cat-pro-add', name: 'cat-pro-add', meta: metas.catPro, component: () => import('@/views/admin/category-products/Form.vue') },
        { path: 'cat-pro-edit/:id', name: 'cat-pro-edit', meta: metas.catPro, component: () => import('@/views/admin/category-products/Form.vue') },

        // news
        { path: 'news', name: 'admin-news', meta: metas.news, component: AdminNews },
        { path: 'news-add', name: 'news-add', meta: metas.news, component: AdminNewsForm },
        { path: 'news-edit/:id', name: 'news-edit', meta: metas.news, component: AdminNewsForm },

        // orders
        { path: 'orders', name: 'orders', meta: metas.orders, component: () => import('@/views/admin/orders/List.vue') },

        // users
        { path: 'user', name: 'admin-user', component: () => import('@/views/auth/User.vue') },
        { path: 'user-add', name: 'user-add', component: () => import('@/views/auth/UserForm.vue') },
        { path: 'user-edit/:id', name: 'user-edit', component: () => import('@/views/auth/UserForm.vue') }, // <-- FIX cú pháp
        // contacts
        { path: 'contact', name: 'admin-contact', component: () => import('@/views/admin/contact-admin/ContactList.vue') }
      ]
    },

    // 404 fallback
    { path: '/:pathMatch(.*)*', redirect: '/' }
  ]
})

/** Global guard: kiểm tra đăng nhập & quyền */
router.beforeEach((to, from, next) => {
  const auth = useAuth()

  // set title nếu có (metas.* bạn đang dùng đã có title)
  const title = to.meta?.title || (typeof to.meta === 'object' && to.meta?.title)
  if (title) document.title = title

  if (to.matched.some(r => r.meta?.requiresAuth)) {
    if (!auth.isAuthenticated) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }
    const roles = to.meta?.roles
    if (Array.isArray(roles) && roles.length && !roles.includes(auth.user?.role)) {
      return next({ name: 'home' })
    }
  }

  next()
})

export default router
