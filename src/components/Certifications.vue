<!-- src/components/Certifications.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'

const certifications = ref([])
const loading = ref(true)

async function fetchCertifications() {
  try {
    const { data, error } = await supabase
      .from('certifications')
      .select('*')
      .order('display_order', { ascending: true })
    if (error) throw error
    certifications.value = data
  } catch (error) {
    console.error('Error fetching certifications:', error.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchCertifications()
})
</script>

<template>
  <section id="sertifikasi" class="py-20 px-6 fade-in-section is-visible">
    <div class="container mx-auto">
      <h2 class="text-4xl md:text-5xl font-bold font-heading text-center mb-12 gradient-text">Sertifikasi</h2>
      <div v-if="loading" class="text-center">Memuat sertifikasi...</div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        <div v-for="cert in certifications" :key="cert.id"
             class="card-hover bg-white p-8 rounded-2xl shadow-lg border border-gray-100 flex flex-col">
          
          <!-- STYLING KEMBALI SEPERTI IKON -->
          <div class="w-16 h-16 rounded-lg mb-6 flex items-center justify-center p-2">
            <img :src="cert.image" :alt="cert.title" class="max-w-full max-h-full object-contain">
          </div>

          <!-- Konten Teks -->
          <div class="flex flex-col flex-grow">
            <h3 class="text-xl font-bold text-gray-800 mb-3 flex-grow">{{ cert.title }}</h3>
            <p class="text-cyan-600 font-semibold mb-2">{{ cert.issuer }}</p>
            <p class="text-gray-500 text-sm mb-4">{{ cert.date }}</p>
            <p class="text-gray-600 text-sm">{{ cert.description }}</p>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>