<!-- src/components/Education.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'

const educationHistory = ref([])
const loading = ref(true)

async function fetchEducation() {
  try {
    const { data, error } = await supabase
      .from('education')
      .select('*')
      .order('display_order', { ascending: true }) // Mengurutkan berdasarkan display_order
    if (error) throw error
    educationHistory.value = data
  } catch (error) {
    console.error('Error fetching education:', error.message)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchEducation()
})
</script>

<template>
  <section id="pendidikan" class="py-20 px-6 fade-in-section is-visible">
    <div class="container mx-auto">
      <h2 class="text-4xl md:text-5xl font-bold font-heading text-center mb-12 gradient-text">Pendidikan</h2>
      <div v-if="loading" class="text-center">Memuat riwayat pendidikan...</div>
      <div v-else class="max-w-4xl mx-auto space-y-8">
        <div v-for="edu in educationHistory" :key="edu.id" 
             class="card-hover bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div class="flex-1">
            <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ edu.institution }}</h3>
            <p class="text-lg text-cyan-600 font-semibold">{{ edu.major }}</p>
            <p class="text-gray-500 mt-2">{{ edu.years }}</p>
            <p v-if="edu.description" class="text-gray-600 mt-4 border-l-4 border-cyan-100 pl-4">
              {{ edu.description }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>