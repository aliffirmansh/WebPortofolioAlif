<!-- src/components/Navbar.vue -->
<script setup>
import { ref } from "vue";

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Fungsi untuk menutup menu mobile saat link diklik
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<template>
  <header class="bg-white/90 header-blur fixed top-0 left-0 right-0 z-50 shadow-lg transition-all duration-300">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
      <router-link to="/" class="text-3xl font-bold gradient-text">Alif Firmansyah Putra</router-link>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-12">
        <router-link to="/#profile" class="text-xl text-gray-600 hover:text-cyan-600 font-medium transition-colors">Profile</router-link>
        <router-link to="/#skills" class="text-xl text-gray-600 hover:text-cyan-600 font-medium transition-colors">Skills</router-link>
        <router-link to="/#pendidikan" class="text-xl text-gray-600 hover:text-cyan-600 font-medium transition-colors">Pendidikan</router-link>
        <router-link to="/#sertifikasi" class="text-xl text-gray-600 hover:text-cyan-600 font-medium transition-colors">Sertifikasi</router-link>
        <router-link to="/#proyek" class="text-xl text-gray-600 hover:text-cyan-600 font-medium transition-colors">Proyek</router-link>
        <router-link to="/#kontak" class="text-xl text-gray-600 hover:text-cyan-600 font-medium transition-colors">Kontak</router-link>
      </nav>

      <a href="https://iruhxnptjagrwggwgtib.supabase.co/storage/v1/object/public/public-assets/CV_Alif%20Firmansyah%20Putra.pdf" download="CV Alif Firmansyah Putra.pdf" target="_blank" rel="noopener noreferrer" class="hidden md:inline-block btn-primary">Unduh CV</a>

      <!-- Mobile Menu Button -->
      <button @click="toggleMobileMenu" class="md:hidden text-gray-800 focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
      </button>
    </div>

    <!-- Mobile Menu -->
    <div :class="{ block: isMobileMenuOpen, hidden: !isMobileMenuOpen }" class="md:hidden px-6 pb-4 bg-white/95 backdrop-blur-sm">
      <div class="space-y-2">
        <router-link to="/#profile" @click="closeMobileMenu" class="block py-3 text-gray-600 hover:text-cyan-600 font-medium transition-colors">Profile</router-link>
        <router-link to="/#skills" @click="closeMobileMenu" class="block py-3 text-gray-600 hover:text-cyan-600 font-medium transition-colors">Skills</router-link>
        <router-link to="/#pendidikan" @click="closeMobileMenu" class="block py-3 text-gray-600 hover:text-cyan-600 font-medium transition-colors">Pendidikan</router-link>
        <router-link to="/#sertifikasi" @click="closeMobileMenu" class="block py-3 text-gray-600 hover:text-cyan-600 font-medium transition-colors">Sertifikasi</router-link>
        <router-link to="/#proyek" @click="closeMobileMenu" class="block py-3 text-gray-600 hover:text-cyan-600 font-medium transition-colors">Proyek</router-link>
        <router-link to="/#kontak" @click="closeMobileMenu" class="block py-3 text-gray-600 hover:text-cyan-600 font-medium transition-colors">Kontak</router-link>
      </div>
      <a href="https://iruhxnptjagrwggwgtib.supabase.co/storage/v1/object/public/public-assets/CV_Alif%20Firmansyah%20Putra.pdf" download="CV Alif Firmansyah Putra.pdf" target="_blank" rel="noopener noreferrer" class="btn-primary block mt-4 text-center"><i class="fas fa-download mr-2"></i>Unduh CV</a>
    </div>
  </header>
</template>