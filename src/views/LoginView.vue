<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabaseClient'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref(null)

async function handleLogin() {
  try {
    loading.value = true
    errorMsg.value = null

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) throw error

    // Jika login berhasil, arahkan ke halaman admin
    router.push('/admin')

  } catch (error) {
    console.error('Error logging in:', error.message)
    errorMsg.value = `Gagal login: ${error.message}`
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
      <h1 class="text-3xl font-bold font-heading mb-6 text-center gradient-text">Admin Login</h1>
      
      <form @submit.prevent="handleLogin">
        <div v-if="errorMsg" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{{ errorMsg }}</p>
        </div>
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
            <input v-model="email" type="email" id="email" required class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
          </div>
          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
            <input v-model="password" type="password" id="password" required class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500">
          </div>
          <div class="text-right">
            <button type="submit" :disabled="loading" class="w-full btn-primary px-6 py-3 text-base disabled:bg-gray-400">
              {{ loading ? 'Logging in...' : 'Login' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>