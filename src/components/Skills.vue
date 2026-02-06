<!-- src/components/Skills.vue -->
<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../lib/supabaseClient'
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const skillCategories = ref([])
const loading = ref(true)

async function fetchSkills() {
  try {
    const { data, error } = await supabase
      .from('skill_categories')
      .select('*')
      .order('created_at', { ascending: true })
    if (error) throw error
    skillCategories.value = data
  } catch (error) {
    console.error('Error fetching skills:', error.message)
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await fetchSkills()
  new Swiper('.skillsSwiper', {
    modules: [Navigation, Pagination],
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.skill-swiper-button-next',
      prevEl: '.skill-swiper-button-prev',
    },
  });
})
</script>

<template>
  <section id="skills" class="py-20 px-6 fade-in-section is-visible">
    <div class="container mx-auto">
      <h2 class="text-4xl md:text-5xl font-bold font-heading text-center mb-12 gradient-text">Skills & Technologies</h2>
      <div v-if="loading" class="text-center">Memuat skills...</div>
      <div v-else class="max-w-5xl mx-auto relative">
        <div class="swiper skillsSwiper">
          <div class="swiper-wrapper">
            <div v-for="category in skillCategories" :key="category.id" class="swiper-slide p-4">
              <div class="text-center mb-8">
                <h3 class="text-2xl font-semibold text-gray-800 mb-2">{{ category.title }}</h3>
                <div class="w-20 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
              </div>
              <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <div v-for="skill in category.skills" :key="skill.name" class="skill-card">
                <i :class="[skill.icon, `text-${skill.color}`]" class="text-3xl mb-3"></i>
                <div>{{ skill.name }}</div>
              </div>
              </div>
            </div>
          </div>
          <div class="swiper-pagination !relative mt-12"></div>
        </div>
        <button class="skill-swiper-button-prev absolute top-1/2 -translate-y-1/2 left-2 md:-left-12 z-10 bg-white shadow-md rounded-full w-12 h-12 flex items-center justify-center text-cyan-600 hover:bg-gray-100 transition-colors duration-300 focus:outline-none">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="skill-swiper-button-next absolute top-1/2 -translate-y-1/2 right-2 md:-right-12 z-10 bg-white shadow-md rounded-full w-12 h-12 flex items-center justify-center text-cyan-600 hover:bg-gray-100 transition-colors duration-300 focus:outline-none">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </section>
</template>