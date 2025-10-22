<!-- src/components/Projects.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient' // <-- 1. Impor klien Supabase

// 2. Buat state reaktif untuk menampung data proyek
const projects = ref([])
const loading = ref(true)
const errorMsg = ref(null)

// 3. Buat fungsi untuk mengambil data dari Supabase
async function fetchProjects() {
  try {
    loading.value = true
    
    // Ini adalah query Supabase: "SELECT * FROM projects ORDER BY created_at DESC"
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    
    projects.value = data // Simpan data yang berhasil diambil ke state

  } catch (error) {
    console.error('Error fetching projects:', error.message)
    errorMsg.value = 'Gagal memuat proyek. Silakan coba lagi nanti.'
  } finally {
    loading.value = false
  }
}

// 4. Panggil fungsi fetchProjects() saat komponen pertama kali di-mount
onMounted(() => {
  fetchProjects()
})
</script>

<template>
  <section id="proyek" class="py-20 px-6 fade-in-section is-visible">
    <div class="container mx-auto">
      <h2 class="text-4xl md:text-5xl font-bold font-heading text-center mb-12 gradient-text">Proyek</h2>

      <!-- Tampilkan pesan loading -->
      <div v-if="loading" class="text-center">
        <p class="text-lg text-gray-600">Memuat proyek...</p>
      </div>

      <!-- Tampilkan pesan error -->
      <div v-else-if="errorMsg" class="text-center">
        <p class="text-lg text-red-500">{{ errorMsg }}</p>
      </div>

      <!-- Tampilkan grid proyek jika data berhasil dimuat -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">

        <!-- Loop untuk setiap item proyek dari Supabase -->
        <div v-for="project in projects" :key="project.id"
             class="card-hover bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 flex flex-col">
          
          <div class="h-48 w-full">
            <img :src="project.image" :alt="project.title + ' Project'" class="w-full h-full object-cover" />
          </div>
          
          <div class="p-8 flex flex-col flex-grow">
            <h3 class="text-2xl font-bold text-gray-800 mb-3">{{ project.title }}</h3>
            <p class="text-gray-600 mb-4 flex-grow">{{ project.description }}</p>
            
            <div class="flex flex-wrap gap-2 mb-6">
              <span v-for="tag in project.tags" :key="tag.text" :class="tag.style"
                    class="px-3 py-1 text-sm rounded-full">
                {{ tag.text }}
              </span>
            </div>

            <a v-if="project.link" :href="project.link" target="_blank"
               class="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-semibold transition-colors mt-auto">
              Lihat Detail <i class="fas fa-arrow-right ml-2"></i>
            </a>

            <p v-else-if="project.status"
               class="inline-flex items-center text-yellow-600 font-semibold mt-auto">
              {{ project.status }}
            </p>

          </div>
        </div>
      </div>
    </div>
  </section>
</template>