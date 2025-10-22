// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabaseClient' // <-- 1. Impor Supabase
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminView,
    meta: { requiresAuth: true } // <-- 2. Tambahkan 'meta' field
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Tambahkan ini agar scroll kembali ke atas saat ganti halaman
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  },
})

// --- 3. INI BAGIAN PALING PENTING: NAVIGATION GUARD ---
router.beforeEach(async (to, from, next) => {
  const { data: { session } } = await supabase.auth.getSession()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  // Jika rute memerlukan login DAN tidak ada sesi (pengguna belum login)
  if (requiresAuth && !session) {
    // Arahkan ke halaman login
    next({ name: 'Login' })
  } 
  // Jika pengguna mencoba mengakses halaman login TAPI SUDAH login
  else if (to.name === 'Login' && session) {
    // Arahkan ke halaman admin
    next({ name: 'Admin' })
  }
  // Jika semua kondisi di atas tidak terpenuhi, izinkan navigasi
  else {
    next()
  }
})

export default router